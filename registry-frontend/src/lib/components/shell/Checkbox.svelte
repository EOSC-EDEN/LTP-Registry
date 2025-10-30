<script lang="ts">
	import CheckIcon from '../icons/CheckIcon.svelte';

	interface Props {
		id: string;
		name: string;
		value: string;
		checked?: boolean;
		onchange?: (event: Event) => void;
	}

	let { id, name, value, checked = false, onchange }: Props = $props();
</script>

<div class="group grid size-4 grid-cols-1">
	<input
		{id}
		type="checkbox"
		{name}
		{value}
		{checked}
		{onchange}
		class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
	/>
	<CheckIcon />
</div>
