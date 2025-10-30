<script lang="ts">
	import FilterSection from './FilterSection.svelte';
	import { getCatalogContext } from '$lib/context/catalog-context.svelte';

	const { filterGroups, updateFilter } = getCatalogContext();
</script>

<form class="hidden lg:block">
	{#each filterGroups as group (group.id)}
		<FilterSection
			id="filter-section-{group.id}"
			title={group.title}
			name={group.name}
			items={group.items}
			groupId={group.propertyUri || group.id}
			onFilterChange={updateFilter}
		/>
	{/each}
</form>
