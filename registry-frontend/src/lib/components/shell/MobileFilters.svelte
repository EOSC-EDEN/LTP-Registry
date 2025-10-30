<script lang="ts">
	import CloseIcon from '../icons/CloseIcon.svelte';
	import FilterSection from './FilterSection.svelte';
	import { getCatalogContext } from '$lib/context/catalog-context.svelte';

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
	}

	let { isOpen = $bindable(false), onClose }: Props = $props();

	const { filterGroups, updateFilter } = getCatalogContext();

	let dialogElement: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (!dialogElement) return;

		if (isOpen) {
			dialogElement.showModal();
		} else {
			dialogElement.close();
		}
	});

	function close() {
		isOpen = false;
		onClose?.();
	}
</script>

{#if isOpen}
	<dialog
		bind:this={dialogElement}
		class="fixed inset-0 z-50 overflow-hidden bg-transparent p-0 backdrop:bg-black/25 lg:hidden"
		onclose={close}
	>
		<div class="fixed inset-0 flex">
			<div
				class="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl"
			>
				<div class="flex items-center justify-between px-4">
					<h2 class="text-lg font-medium text-gray-900">Filters</h2>
					<button
						type="button"
						onclick={close}
						class="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
					>
						<span class="absolute -inset-0.5"></span>
						<span class="sr-only">Close menu</span>
						<CloseIcon />
					</button>
				</div>

				<form class="mt-4 border-t border-gray-200">
					{#each filterGroups as group (group.id)}
						<FilterSection
							id="filter-section-mobile-{group.id}"
							title={group.title}
							name={group.name}
							items={group.items}
							groupId={group.propertyUri || group.id}
							onFilterChange={updateFilter}
							containerClass="border-t border-gray-200 px-4 py-6"
							contentSpacing="space-y-6"
							labelClass="min-w-0 flex-1 text-gray-500"
						/>
					{/each}
				</form>
			</div>
		</div>
	</dialog>
{/if}
