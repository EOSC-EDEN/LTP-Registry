<script lang="ts">
	import PlusIcon from '../icons/PlusIcon.svelte';
	import MinusIcon from '../icons/MinusIcon.svelte';
	import FilterOption from './FilterOption.svelte';

	interface FilterItem {
		value: string;
		label: string;
		checked?: boolean;
	}

	interface Props {
		id: string;
		title: string;
		name: string;
		items: FilterItem[];
		groupId: string;
		onFilterChange?: (groupId: string, value: string, checked: boolean) => void;
		containerClass?: string;
		contentSpacing?: string;
		labelClass?: string;
	}

	let {
		id,
		title,
		name,
		items,
		groupId,
		onFilterChange,
		containerClass = 'border-b border-gray-200 py-6',
		contentSpacing = 'space-y-4',
		labelClass = 'text-sm text-gray-600'
	}: Props = $props();

	let isExpanded = $state(false);

	function toggle() {
		isExpanded = !isExpanded;
	}

	function handleFilterChange(value: string, checked: boolean) {
		if (onFilterChange) {
			onFilterChange(groupId, value, checked);
		}
	}
</script>

<div class={containerClass}>
	<h3 class="-my-3 flow-root">
		<button
			type="button"
			onclick={toggle}
			aria-expanded={isExpanded}
			class="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
		>
			<span class="font-medium text-gray-900">{title}</span>
			<span class="ml-6 flex items-center">
				{#if isExpanded}
					<MinusIcon class="size-5" />
				{:else}
					<PlusIcon class="size-5" />
				{/if}
			</span>
		</button>
	</h3>
	{#if isExpanded}
		<div class="block pt-6">
			<div class={contentSpacing}>
				{#each items as item, index (item.value)}
					<FilterOption
						id="{id}-{index}"
						{name}
						value={item.value}
						label={item.label}
						checked={item.checked}
						{labelClass}
						onChange={handleFilterChange}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
