<script lang="ts">
	import type { NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import SignOut from '../SignOut.svelte';
	import { page } from '$app/stores';

	export let linkItem: NavLinkItem;
	export let supabase: SupabaseClient | null = null;
</script>

{#if !linkItem.isSignout}
	<a
		role="menuitem"
		href={linkItem.href}
		aria-current={linkItem.href === $page.url.pathname ? 'page' : undefined}>{linkItem.text}</a
	>
{:else if supabase && linkItem.isSignout}
	<SignOut {supabase} />
{/if}
