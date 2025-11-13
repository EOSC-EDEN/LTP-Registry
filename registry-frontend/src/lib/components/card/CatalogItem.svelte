<script lang="ts">
	import PropertyRow from './PropertyRow.svelte';
	import PropertyList from './PropertyList.svelte';
	import type { GroupedProperty } from '$lib/context/catalog-context.svelte';

	interface Props {
		serviceUri: string;
		title?: string;
		description?: string;
		properties: GroupedProperty[];
	}

	let { serviceUri, title, description, properties }: Props = $props();

	function isUri(value: string): boolean {
		return (
			value.startsWith('http://') || value.startsWith('https://') || value.startsWith('mailto:')
		);
	}

	function shouldDisplayAsBadges(propLabel: string): boolean {
		const badgeProps = ['keyword', 'theme', 'keywords', 'themes'];
		return badgeProps.some((p) => propLabel.toLowerCase().includes(p));
	}
</script>

<div class="overflow-hidden border border-gray-300 bg-white shadow-sm sm:rounded-lg">
	<div class="px-4 py-6 sm:px-6">
		<a href={serviceUri} class="text-base/7 font-semibold text-indigo-600 hover:text-indigo-500"
			>{title || 'Untitled Service'}</a
		>
		{#if description}
			<p class="mt-1 max-w-2xl text-sm/6 text-gray-500">{description}</p>
		{/if}
	</div>
	<div class="border-t border-gray-100">
		<dl class="divide-y divide-gray-100">
			{#each properties as property (property.propUri)}
				{#if property.propLabel.toLowerCase() === 'title' || property.propLabel.toLowerCase() === 'description'}
                    <!-- Hide title and description from property list -->
                {:else if property.propLabel.toLowerCase() === 'has cpp'}
                    <!-- Custom rendering for CPP property -->
                    <PropertyList
                        label="+ CPP"
                        values={property.values.map((v) => v.val)}
                        displayLabels={property.values.map((v) => `[${v.valLabel}]`)}
                        isUri={true}
                        asBadges={false}
                    />
				{:else if property.values.length === 1}
					<PropertyRow
						label={property.propLabel}
						value={isUri(property.values[0].val)
							? property.values[0].val
							: property.values[0].valLabel}
						displayLabel={property.values[0].valLabel}
						isUri={isUri(property.values[0].val)}
					/>
				{:else}
					<PropertyList
						label={property.propLabel}
						values={property.values.map((v) => (isUri(v.val) ? v.val : v.valLabel))}
						displayLabels={property.values.map((v) => v.valLabel)}
						isUri={property.values.some((v) => isUri(v.val))}
						asBadges={shouldDisplayAsBadges(property.propLabel)}
					/>
				{/if}
			{/each}
		</dl>
	</div>
</div>
