<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	export let indicator: boolean = false;
	export let posRight: boolean = false;

	let isOpen = false;
	let dropdown: HTMLDivElement;

	const DropdownIcon = {
		closed: '&#x25BC;',
		open: '&#x25B2;'
	};

	onMount(() => {
		const handleClickAnywhere = ({ target }: MouseEvent) => {
			if (!isOpen || !target) return;
			const clickTarget = target as HTMLElement;
			if (!dropdown.contains(clickTarget) || clickTarget.closest('a')) {
				isOpen = false;
			}
		};

		document.addEventListener('click', handleClickAnywhere);

		return () => {
			document.removeEventListener('click', handleClickAnywhere);
		};
	});
</script>

<div bind:this={dropdown} class="relative block">
	<div class="dropdown-title block w-full">
		<button class="flex w-full" on:click={() => (isOpen = !isOpen)}>
			{#if indicator}
				<span class="mr-1">{@html isOpen ? DropdownIcon.open : DropdownIcon.closed}</span>
			{/if}
			<slot name="dropdown"></slot>
		</button>
	</div>
	{#if isOpen}
		<ul
			class:right-0={posRight}
			class="absolute rounded-box min-w-52 shadow z-[1] m-0 menu p-2 bg-base-100 text-base-content block"
			transition:slide={{ duration: 200, easing: cubicInOut }}
		>
			<slot />
		</ul>
	{/if}
</div>
