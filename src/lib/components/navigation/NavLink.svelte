<script lang="ts">
	import type { NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import SignOut from '../SignOut.svelte';

	export let linkItem: NavLinkItem;
	export let supabase: SupabaseClient | null = null;
</script>

{#if !linkItem.isSignout}
	<a href={linkItem.href}>{linkItem.text}</a>
{:else if supabase && linkItem.isSignout}
	<SignOut {supabase} />
{/if}
