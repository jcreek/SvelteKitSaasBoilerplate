<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { basket, type Basket, type Item } from '$lib/stores/basket.js';

	/** @type {import('./$types').PageData} */
	export let data;

	let localBasket: Basket;
	const unsubscribeToBasket = basket.subscribe((value) => {
		localBasket = value;
	});
	onDestroy(unsubscribeToBasket);

	function addToBasket() {
		basket.update((value) => {
			const existingItemIndex = value.items.findIndex((basketItem) => basketItem.id === item.id);

			if (existingItemIndex !== -1) {
				// Item already exists in the basket, increase quantity
				const newItems = [...value.items];
				newItems[existingItemIndex].quantity += 1;
				return { ...value, items: newItems };
			} else {
				// Item does not exist in the basket, add new item
				return {
					...value,
					items: [...value.items, item]
				};
			}
		});
	}

	let item = {};

	onMount(() => {
		fetch(`/products/${data.productId}`)
			.then((response) => response.json())
			.then((product) => {
				item = {
					id: product.id,
					name: product.name,
					categoryDescription: product.description,
					imgAlt: product.description,
					imgSrc: product.images[0],
					price: 0,
					priceId: product.default_price,
					quantity: 1
				};

				// Fetch the price of the product
				fetch(`/products/prices/${product.default_price}`)
					.then((response) => response.json())
					.then((price) => {
						item.price = price.unit_amount / 100;
					});
			});
	});
</script>

data.productId= {data.productId}
<br />
item.id= {item.id}
<br />
item.name= {item.name}
<br />
<button class="btn" on:click={addToBasket}>Add to basket</button>
