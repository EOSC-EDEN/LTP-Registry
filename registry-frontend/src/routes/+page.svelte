<script lang="ts">
	import CatalogItem from '$lib/components/card/CatalogItem.svelte';
	import CatalogShell from '$lib/components/shell/CatalogShell.svelte';
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import type { ServiceWithProperties } from '$lib/context/catalog-context.svelte';
	import type { QueryResult } from '$lib/server/rdf-file-query';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Create reactive state for services and facets
	let services = $state<ServiceWithProperties[]>(data.services);
	let facets = $state<QueryResult>(data.facets);

	// Update reactive state when data changes
	$effect(() => {
		services = data.services;
		facets = data.facets;
	});

	// Handler for when filters change - will trigger re-query
	async function handleFilterChange(filters: Map<string, string[]>) {
		// Convert Map to plain object
		const filtersObj: Record<string, string[]> = {};
		for (const [key, value] of filters) {
			filtersObj[key] = value;
		}

		// Create form data for SvelteKit action
		const formData = new FormData();
		formData.append('filters', JSON.stringify(filtersObj));

		// Call server action to re-query
		const response = await fetch('?/filter', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const result = deserialize(await response.text());

			// Update reactive state - this will trigger reactivity
			if (result.type === 'success' && result.data) {
				const actionData = result.data as {
					services: ServiceWithProperties[];
					facets: QueryResult;
				};
				services = actionData.services;
				facets = actionData.facets;
			}
		}
	}
</script>

<CatalogShell
	title="EOSC-EDEN Registry Catalog"
	facets={facets.bindings}
	onFilterChange={handleFilterChange}
>
	<div class="space-y-4">
		{#each services as service (service.serviceUri)}
			<CatalogItem
				serviceUri={service.serviceUri}
				title={service.title}
				description={service.description}
				properties={service.properties}
			/>
		{/each}
	</div>
</CatalogShell>
