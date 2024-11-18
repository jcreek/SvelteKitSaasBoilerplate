<script lang="ts">
	import { type NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import { cubicInOut } from 'svelte/easing';
	import Dropdown from '../Dropdown.svelte';
	import { slide } from 'svelte/transition';
	import NavLink from './NavLink.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let linkItem: NavLinkItem;
	export let isMobile: boolean;
	export let supabase: SupabaseClient | null;

	let isOpen = false;
</script>

{#if !isMobile}
	<Dropdown indicator>
		<div slot="dropdown">{linkItem.text}</div>
		{#each linkItem.children ?? [] as child (child.text.replace(' ', '-').toLowerCase())}
			<li><NavLink linkItem={child} /></li>
		{/each}
	</Dropdown>
{:else}
	<button
		class:menu-dropdown-show={isOpen}
		class="menu-dropdown-toggle"
		on:click={() => (isOpen = !isOpen)}
	>
		{linkItem.text}
	</button>
	{#if isOpen}
		<ul
			role="menu"
			class="menu-dropdown menu-dropdown-show"
			transition:slide={{ duration: 200, easing: cubicInOut }}
		>
			{#each linkItem.children ?? [] as child (child.text.replace(' ', '-').toLowerCase())}
				<li><NavLink linkItem={child} {supabase} /></li>
			{/each}
		</ul>
	{/if}
{/if}
