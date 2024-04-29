<script lang="ts">
	import { onDestroy } from 'svelte';
	import { user } from '$lib/stores/user.js';
	import { type User } from '@supabase/auth-js';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let localUser: User | null;
	const unsubscribe = user.subscribe((value) => {
		localUser = value;
	});
	onDestroy(unsubscribe);
</script>

<div class="h-screen">
	{#if localUser}
		{localUser?.email}
	{:else}
		<p>Please log in to view this page</p>
	{/if}
</div>
