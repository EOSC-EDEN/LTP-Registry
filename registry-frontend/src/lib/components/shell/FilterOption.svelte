<script lang="ts">
	import Checkbox from './Checkbox.svelte';

	interface Props {
		id: string;
		name: string;
		value: string;
		label: string;
		checked?: boolean;
		labelClass?: string;
		onChange?: (value: string, checked: boolean) => void;
	}

	let {
		id,
		name,
		value,
		label,
		checked = false,
		labelClass = 'text-sm text-gray-600',
		onChange
	}: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (onChange) {
			onChange(value, target.checked);
		}
	}
</script>

<div class="flex gap-3">
	<div class="flex h-5 shrink-0 items-center">
		<Checkbox {id} {name} {value} {checked} onchange={handleChange} />
	</div>
	<label for={id} class={labelClass}>{label}</label>
</div>
