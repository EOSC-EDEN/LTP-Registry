<script lang="ts">
	interface Props {
		label: string;
		value: string;
		displayLabel?: string;
		isUri?: boolean;
	}

	let { label, value, displayLabel, isUri = false }: Props = $props();
</script>

<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
	<dt class="text-sm font-medium text-gray-900">{label}</dt>
	<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
		{#if isUri}
			<a
				href={value}
				class="text-indigo-600 hover:text-indigo-500"
				target="_blank"
				rel="noopener noreferrer"
			>
				{displayLabel || value}
			</a>
		{:else}
			{value}
		{/if}
	</dd>
</div>
