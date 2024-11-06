<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { basket, type Basket, type Item } from '$lib/stores/basket.js';
	import { logger } from '$lib/utils/logger.js';

	const dispatch = createEventDispatcher();

	function emitSignedOutEvent() {
		dispatch('signedOut', {});
	}

	// Access the supabase client from the layout data
	export let supabase: any;

	let localBasket: Basket;
	const unsubscribe = basket.subscribe((value) => {
		localBasket = value;
	});

	onDestroy(unsubscribe);

	async function signOut() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			logger.error('Error signing out:', error.message);
			alert('Error signing out');
			return;
		}

		try {
			emitSignedOutEvent();

			// Clear the basket
			localBasket = { items: [], subtotal: 0 };
			basket.set(localBasket);
			unsubscribe();
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('basket');
			}
		} catch (err) {
			logger.error('Error clearing basket:', err);
			alert('Error clearing basket');
		}
	}
</script>

<button on:click={signOut}>Sign Out</button>
