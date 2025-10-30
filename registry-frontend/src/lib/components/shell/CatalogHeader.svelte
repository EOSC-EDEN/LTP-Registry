<script lang="ts">
	import FilterIcon from '../icons/FilterIcon.svelte';

	interface SortOption {
		label: string;
		href: string;
		selected?: boolean;
	}

	interface Props {
		title: string;
		onOpenFilters?: () => void;
	}

	let { title, onOpenFilters }: Props = $props();
</script>

<div class="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
	<h1 class="text-4xl font-bold tracking-tight text-gray-900">{title}</h1>

	<div class="flex items-center">
		<button
			type="button"
			onclick={onOpenFilters}
			class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
		>
			<span class="sr-only">Filters</span>
			<FilterIcon />
		</button>
	</div>
</div>
