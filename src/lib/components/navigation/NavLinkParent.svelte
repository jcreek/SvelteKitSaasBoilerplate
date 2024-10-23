<script lang="ts">
	import { type NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import { cubicInOut } from 'svelte/easing';
	import Dropdown from '../Dropdown.svelte';
	import { slide } from 'svelte/transition';

	export let text: string;
	export let children: NavLinkItem[] | undefined;
	export let isMobile: boolean;

	let isOpen = false;
</script>

{#if !isMobile}
	<Dropdown indicator>
		<div slot="dropdown">{text}</div>
		{#each children ?? [] as child}
			<li><a href={child.href}>{child.text}</a></li>
		{/each}
	</Dropdown>
{:else}
	<button
		class:menu-dropdown-show={isOpen}
		class="menu-dropdown-toggle"
		on:click={() => (isOpen = !isOpen)}
	>
		{text}
	</button>
	{#if isOpen}
		<ul
			class="menu-dropdown menu-dropdown-show"
			transition:slide={{ duration: 200, easing: cubicInOut }}
		>
			{#each children ?? [] as child}
				<li><a href={child.href}>{child.text}</a></li>
			{/each}
		</ul>
	{/if}
{/if}
