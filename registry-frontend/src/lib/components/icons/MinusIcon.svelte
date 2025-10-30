<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = 'size-5' }: Props = $props();
</script>

<svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class={className}>
	<path
		d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
		clip-rule="evenodd"
		fill-rule="evenodd"
	/>
</svg>
