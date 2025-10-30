<script lang="ts">
	interface Props {
		label: string;
		values: string[];
		displayLabels?: string[];
		isUri?: boolean;
		asBadges?: boolean;
	}

	let { label, values, displayLabels, isUri = false, asBadges = false }: Props = $props();
</script>

<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
	<dt class="text-sm font-medium text-gray-900">{label}</dt>
	<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
		{#if asBadges}
			<div class="flex flex-wrap gap-2">
				{#each values as value, i}
					<span
						class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
					>
						{displayLabels?.[i] || value}
					</span>
				{/each}
			</div>
		{:else if isUri}
			<div class="space-y-1">
				{#each values as value, i}
					<div>
						<a
							href={value}
							class="text-indigo-600 hover:text-indigo-500"
							target="_blank"
							rel="noopener noreferrer"
						>
							{displayLabels?.[i] || value}
						</a>
					</div>
				{/each}
			</div>
		{:else}
			<div class="space-y-1">
				{#each values as value}
					<div>{value}</div>
				{/each}
			</div>
		{/if}
	</dd>
</div>
