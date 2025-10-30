<script lang="ts">
	interface Props {
		class?: string;
	}

	let {
		class:
			className = 'pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25'
	}: Props = $props();
</script>

<svg viewBox="0 0 14 14" fill="none" class={className}>
	<path
		d="M3 8L6 11L11 3.5"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="opacity-0 group-has-checked:opacity-100"
	/>
	<path
		d="M3 7H11"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="opacity-0 group-has-indeterminate:opacity-100"
	/>
</svg>
