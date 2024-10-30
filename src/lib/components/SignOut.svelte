<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { basket, type Basket, type Item } from '$lib/stores/basket.js';

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

	async function signOut() {
		// TODO use the error from the response
		const { error } = await supabase.auth.signOut().then(() => {
			emitSignedOutEvent();

			// Clear the basket
			localBasket = { items: [], subtotal: 0 };
			basket.set(localBasket);
			unsubscribe();
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('basket');
			}
		});
	}
</script>

<button on:click={signOut}>Sign Out</button>
