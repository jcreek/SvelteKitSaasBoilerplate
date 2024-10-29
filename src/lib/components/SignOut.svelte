<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { signOut } from '$lib/utils/supabase/auth';
	import type { SupabaseClient } from '@supabase/supabase-js';
	const dispatch = createEventDispatcher();

	function emitSignedOutEvent() {
		dispatch('signedOut', {});
	}

	// Access the supabase client from the layout data
	export let supabase: SupabaseClient | null;

	async function signOutClick() {
		if (!supabase) return;
		await signOut(supabase, emitSignedOutEvent);
	}
</script>

<button on:click={signOutClick}>Sign Out</button>
