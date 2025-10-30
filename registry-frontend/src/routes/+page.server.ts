import { queryDataServiceFacets, queryDataServiceDetails } from '$lib/server/rdf-endpoint-query';
import type { PageServerLoad, Actions } from './$types';
import { groupPropertiesByService } from '$lib/context/catalog-context.svelte';
import type { DataServiceProperty } from '$lib/context/catalog-context.svelte';

export const load: PageServerLoad = async () => {
	// Query facets for filters
	const facets = await queryDataServiceFacets();

	// Query DataService details with all properties
	const detailsResult = await queryDataServiceDetails();
	const properties = detailsResult.bindings as unknown as DataServiceProperty[];
	const servicesMap = groupPropertiesByService(properties);
	const services = Array.from(servicesMap.values());

	return {
		facets,
		services
	};
};

export const actions = {
	filter: async ({ request }) => {
		const formData = await request.formData();
		const filtersJson = formData.get('filters');

		const filters = new Map<string, string[]>();
		if (filtersJson && typeof filtersJson === 'string') {
			const filtersObj = JSON.parse(filtersJson);
			for (const [key, value] of Object.entries(filtersObj)) {
				filters.set(key, value as string[]);
			}
		}

		// Re-query with filters
		const detailsResult = await queryDataServiceDetails(filters);
		const properties = detailsResult.bindings as unknown as DataServiceProperty[];
		const servicesMap = groupPropertiesByService(properties);
		const services = Array.from(servicesMap.values());

		const facets = await queryDataServiceFacets();

		return {
			success: true,
			services,
			facets
		};
	}
} satisfies Actions;
