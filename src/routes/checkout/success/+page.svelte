<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { basket, type Basket, type Item } from '$lib/stores/basket.js';
	import OrderConfirmationItem from '$lib/components/checkout/OrderConfirmationItem.svelte';

	let orderConfirmationBasket: Basket;
	let localBasket: Basket;
	const unsubscribe = basket.subscribe((value) => {
		localBasket = value;
	});
	onDestroy(unsubscribe);

	onMount(() => {
		calculateSubtotal();

		// Create a deep copy of the basket to store the order confirmation then clear the basket
		orderConfirmationBasket = JSON.parse(JSON.stringify(localBasket));
		localBasket = { items: [], subtotal: 0 };
		basket.set(localBasket);
		unsubscribe();
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('basket');
		}
	});

	function calculateSubtotal() {
		let subtotal = 0;
		localBasket.items.forEach((item) => {
			subtotal += item.price * item.quantity;
		});
		localBasket.subtotal = subtotal;
	}
</script>

<section class="py-24 relative">
	<div class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
		<h2 class="font-manrope font-bold text-4xl leading-10 text-black text-center">
			Payment Successful
		</h2>
		<p class="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
			Thanks for making a purchase you can check our order summary below
		</p>
		<div
			class="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full"
		>
			<!-- <div
				class="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200"
			>
				<div class="data">
					<p class="font-semibold text-base leading-7 text-black">
						Order Id: <span class="text-indigo-600 font-medium">#10234987</span>
					</p>
					<p class="font-semibold text-base leading-7 text-black mt-4">
						Order Payment : <span class="text-gray-400 font-medium"> 18th march 2021</span>
					</p>
				</div>
				<button
					class="rounded-full py-3 px-7 font-semibold text-sm leading-7 text-white bg-indigo-600 max-lg:mt-5 shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400"
					>Track Your Order</button
				>
			</div> -->
			<div class="w-full px-3 min-[400px]:px-6">
				{#if orderConfirmationBasket == undefined}
					<p class="font-semibold text-lg leading-7 text-black text-center">
						No items in the basket
					</p>
				{:else}
					{#each orderConfirmationBasket.items as item (item.id)}
						<OrderConfirmationItem
							itemCategoryDescription={item.categoryDescription}
							itemName={item.name}
							imgAlt={item.imgAlt}
							imgSrc={item.imgSrc}
							price={item.price}
							quantity={item.quantity}
						/>
					{/each}
				{/if}
			</div>
			<div
				class="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between"
			>
				<div class="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200"></div>
				<p class="font-semibold text-lg text-black py-6">
					Total Price: <span class="text-indigo-600"> $xx.xx</span>
				</p>
			</div>
		</div>
	</div>
</section>
