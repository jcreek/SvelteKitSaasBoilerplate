<script lang="ts">
	import { onDestroy } from 'svelte';
	import { type User } from '@supabase/auth-js';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="h-screen">
	{#if session?.user}
		{session?.user?.email}
	{:else}
		<p>Please log in to view this page</p>
	{/if}
</div>
