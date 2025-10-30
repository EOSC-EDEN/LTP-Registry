import { createContext } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

export interface FilterItem {
	value: string;
	label: string;
	checked?: boolean;
	count?: number;
}

export interface FilterGroup {
	id: string;
	title: string;
	name: string;
	items: FilterItem[];
	propertyUri?: string;
}

// Type for raw query results from RDF query
export type QueryBinding = Record<string, string>;

// Interface for dynamic DataService property query results
export interface DataServiceProperty {
	service: string; // URI
	prop: string; // property URI
	propLabel: string; // formatted property label
	val: string; // value (URI or literal)
	valLabel: string; // formatted value label
}

// Grouped properties by property URI
export interface GroupedProperty {
	propUri: string;
	propLabel: string;
	values: Array<{ val: string; valLabel: string }>;
}

// Service with grouped properties
export interface ServiceWithProperties {
	serviceUri: string;
	title?: string;
	description?: string;
	properties: GroupedProperty[];
}

/**
 * Groups DataServiceProperty results by service and property
 * Ensures all services have the same properties in the same order (with empty values for missing properties)
 * @param properties - Array of DataServiceProperty results from SPARQL query
 * @returns Map of service URI to ServiceWithProperties
 */
export function groupPropertiesByService(
	properties: DataServiceProperty[]
): Map<string, ServiceWithProperties> {
	const servicesMap = new Map<string, ServiceWithProperties>();

	// Collect all unique properties (propUri + propLabel pairs)
	const allPropertiesMap = new Map<string, string>(); // propUri -> propLabel

	for (const prop of properties) {
		if (!allPropertiesMap.has(prop.prop)) {
			allPropertiesMap.set(prop.prop, prop.propLabel);
		}
	}

	// Derive services
	for (const prop of properties) {
		// Get or create service entry
		if (!servicesMap.has(prop.service)) {
			servicesMap.set(prop.service, {
				serviceUri: prop.service,
				properties: []
			});
		}

		const service = servicesMap.get(prop.service)!;

		// Extract title and description
		if (prop.propLabel === 'Label' || prop.propLabel === 'Title') {
			service.title = prop.valLabel;
		} else if (prop.propLabel === 'Description') {
			service.description = prop.valLabel;
		}

		// Find or create property group
		let propertyGroup = service.properties.find((p) => p.propUri === prop.prop);
		if (!propertyGroup) {
			propertyGroup = {
				propUri: prop.prop,
				propLabel: prop.propLabel,
				values: []
			};
			service.properties.push(propertyGroup);
		}

		// Add value to property group
		propertyGroup.values.push({
			val: prop.val,
			valLabel: prop.valLabel
		});
	}

	// Ensure all services have all properties
	// Sort properties alphabetically by label
	const sortedProperties = Array.from(allPropertiesMap.entries()).sort((a, b) =>
		a[1].localeCompare(b[1])
	);

	for (const service of servicesMap.values()) {
		const existingProps = new Map(service.properties.map((p) => [p.propUri, p]));

		// Rebuild properties array with all properties in sorted order
		service.properties = sortedProperties.map(([propUri, propLabel]) => {
			const existing = existingProps.get(propUri);
			if (existing) {
				return existing;
			} else {
				// Property doesn't exist for this service - add placeholder
				return {
					propUri,
					propLabel,
					values: [{ val: '', valLabel: '—' }] // Em dash for missing values
				};
			}
		});
	}

	return servicesMap;
}

// Interface for facet query results (DataService-centric)
export interface FacetBinding {
	prop: string;
	propLabel: string; // Human-readable property label
	val: string;
	valLabel: string; // Human-readable value label
	count: string;
}

// Catalog context value interface
export interface CatalogContextValue {
	filterGroups: FilterGroup[];
	selectedFilters: SvelteMap<string, Set<string>>;
	updateFilter: (propertyUri: string, valueUri: string, checked: boolean) => Promise<void>;
	isLoading: boolean;
}

// Create type-safe context getters/setters
export const [getCatalogContext, setCatalogContext] = createContext<CatalogContextValue>();

// Derives filter groups from SPARQL facet query results (DataService-centric)
export function deriveFilterGroups(facets: FacetBinding[]): FilterGroup[] {
	// Group by prop with deduplication by value URI
	const groupMap = new SvelteMap<
		string,
		{ propLabel: string; itemsMap: Map<string, FilterItem> }
	>();

	for (const binding of facets) {
		const { prop, propLabel, val, valLabel, count } = binding;

		if (!groupMap.has(prop)) {
			groupMap.set(prop, { propLabel, itemsMap: new Map() });
		}

		const group = groupMap.get(prop)!;

		// Deduplicate by value URI - keep the first occurrence or merge counts
		if (!group.itemsMap.has(val)) {
			group.itemsMap.set(val, {
				value: val,
				label: `${valLabel} (${count})`,
				count: parseInt(count, 10),
				checked: false
			});
		}
	}

	// Convert map structure to FilterGroup array
	const filterGroups: FilterGroup[] = [];

	for (const [prop, { propLabel, itemsMap }] of groupMap) {
		const items = Array.from(itemsMap.values());
		filterGroups.push({
			id: propLabel,
			title: propLabel, // Use label directly from SPARQL query
			name: propLabel,
			propertyUri: prop, // Keep original URI for filtering
			items: items.sort((a, b) => (b.count || 0) - (a.count || 0)) // Sort by count descending
		});
	}

	return filterGroups;
}

/**
 * Initialize catalog context value from SPARQL facets
 * Use this to create the context value, then pass it to setCatalogContext()
 * Accepts either typed FacetBinding[] or raw QueryBinding[] (Record<string, string>[])
 *
 * @param facets - Initial facet data
 * @param onFilterChange - Callback to trigger when filters change (for re-querying)
 */
export function createCatalogContextValue(
	facets: FacetBinding[] | QueryBinding[],
	onFilterChange?: (filters: Map<string, string[]>) => Promise<void>
): CatalogContextValue {
	// Convert raw query bindings to typed bindings if needed
	const typedFacets: FacetBinding[] =
		facets.length > 0 && 'prop' in facets[0] && !('entityType' in facets[0])
			? (facets as FacetBinding[])
			: (facets as QueryBinding[]).map((b) => ({
					prop: b.prop,
					propLabel: b.propLabel,
					val: b.val,
					valLabel: b.valLabel,
					count: b.count
				}));

	const filterGroups = $state(deriveFilterGroups(typedFacets));
	const selectedFilters = new SvelteMap<string, Set<string>>();
	const state = $state({ isLoading: false });

	const updateFilter = async (propertyUri: string, valueUri: string, checked: boolean) => {
		if (!selectedFilters.has(propertyUri)) {
			selectedFilters.set(propertyUri, new SvelteSet());
		}

		const propFilters = selectedFilters.get(propertyUri)!;
		if (checked) {
			propFilters.add(valueUri);
		} else {
			propFilters.delete(valueUri);
		}

		// If callback provided, trigger re-query
		if (onFilterChange) {
			state.isLoading = true;
			try {
				// Convert SvelteMap to regular Map with arrays
				const filtersMap = new Map<string, string[]>();
				for (const [prop, values] of selectedFilters) {
					if (values.size > 0) {
						filtersMap.set(prop, Array.from(values));
					}
				}
				await onFilterChange(filtersMap);
			} finally {
				state.isLoading = false;
			}
		}
	};

	return {
		filterGroups,
		selectedFilters,
		updateFilter,
		get isLoading() {
			return state.isLoading;
		}
	};
}
