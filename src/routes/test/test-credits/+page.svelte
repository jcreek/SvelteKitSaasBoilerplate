<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;

	let { session, supabase, user } = data;
	$: ({ session, supabase, user } = data);

	const credits = writable<number>(0);
	let errorMessage: string = '';

	onMount(async () => {
		try {
			const pageUserId = user?.id;
			if (pageUserId) {
				const response = await fetch('/test/test-credits', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action: 'getUserCredits', userId: pageUserId })
				});
				if (!response.ok) throw new Error('Failed to fetch credits');
				const { credits: fetchedCredits } = await response.json();
				credits.set(fetchedCredits);
			}
		} catch (error) {
			errorMessage = error.message;
		}
	});

	const addCredits = async () => {
		try {
			const response = await fetch('/test/test-credits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'addCredits',
					userId: user?.id,
					credits: 10,
					description: 'Test add credits'
				})
			});
			if (!response.ok) throw new Error('Failed to add credits');
			const { credits: updatedCredits } = await response.json();
			credits.set(updatedCredits);
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const deductCredits = async () => {
		try {
			const response = await fetch('/test/test-credits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'deductCredits',
					userId: user?.id,
					credits: 5,
					description: 'Test deduct credits'
				})
			});
			if (!response.ok) throw new Error('Failed to deduct credits');
			const { credits: updatedCredits } = await response.json();
			credits.set(updatedCredits);
		} catch (error) {
			errorMessage = error.message;
		}
	};
</script>

<main>
	<h1>Credits Management for User: {user?.id}</h1>
	<p>Credits Remaining: {$credits}</p>
	{#if errorMessage}
		<p style="color: red;">{errorMessage}</p>
	{/if}

	<button on:click={addCredits}>Add 10 Credits</button>
	<button on:click={deductCredits}>Deduct 5 Credits</button>
</main>

<style>
	main {
		text-align: center;
		padding: 2rem;
	}
	button {
		margin: 0.5rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
</style>
