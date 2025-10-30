<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = 'size-6' }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	data-slot="icon"
	aria-hidden="true"
	class={className}
>
	<path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
</svg>
