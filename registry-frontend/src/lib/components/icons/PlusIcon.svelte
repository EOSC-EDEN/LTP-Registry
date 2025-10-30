<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = 'size-5' }: Props = $props();
</script>

<svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class={className}>
	<path
		d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
	/>
</svg>
