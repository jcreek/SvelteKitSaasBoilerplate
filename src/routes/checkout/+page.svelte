<script src="https://js.stripe.com/v3/" lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { basket, type Basket } from '$lib/stores/basket.js';
	import BasketItem from '$lib/components/checkout/BasketItem.svelte';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let localBasket: Basket;
	const unsubscribe = basket.subscribe((value) => {
		localBasket = value;
	});
	onDestroy(unsubscribe);
	onMount(() => {
		calculateSubtotal();
	});

	function calculateSubtotal() {
		let subtotal = 0;
		localBasket.items.forEach((item) => {
			subtotal += item.price * item.quantity;
		});
		localBasket.subtotal = subtotal;
	}

	function removeItem(event: CustomEvent<{ itemId: number }>) {
		localBasket.items = localBasket.items.filter((item) => item.id !== event.detail.itemId);
		basket.set(localBasket);
		calculateSubtotal();
	}

	function changeQuantity(event: CustomEvent<{ itemId: number; quantity: number }>) {
		localBasket.items = localBasket.items.map((item) => {
			if (item.id === event.detail.itemId) {
				item.quantity = event.detail.quantity;
			}
			return item;
		});
		basket.set(localBasket);
		calculateSubtotal();
	}
</script>

<section class="py-24 relative">
	<div class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
		<h2 class="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">
			Basket
		</h2>
		<div class="hidden lg:grid grid-cols-2 py-6">
			<div class="font-normal text-xl leading-8 text-gray-500">Product</div>
			<p class="font-normal text-xl leading-8 text-gray-500 flex items-center justify-between">
				<span class="w-full max-w-[260px] text-center">Quantity</span>
				<span class="w-full max-w-[200px] text-center">Total</span>
			</p>
		</div>

		{#each localBasket.items as item (item.id)}
			<BasketItem
				itemCategoryDescription={item.categoryDescription}
				itemId={item.id}
				itemName={item.name}
				imgAlt={item.imgAlt}
				imgSrc={item.imgSrc}
				price={item.price}
				quantity={item.quantity}
				on:changeQuantity={changeQuantity}
				on:removeItem={removeItem}
			/>
		{/each}
		<div class="bg-gray-50 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto">
			<div class="flex items-center justify-between w-full pb-6 border-b border-gray-200">
				<p class="font-normal text-base leading-8 text-gray-400">
					Shipping, taxes and discounts calculated at checkout
				</p>
			</div>
			<div class="flex items-center justify-between w-full py-6">
				<p class="font-manrope font-medium text-2xl leading-9 text-gray-900">Subtotal</p>
				<h6 class="font-manrope font-medium text-2xl leading-9 text-indigo-500">
					£{localBasket.subtotal.toFixed(2)}
				</h6>
			</div>
		</div>
		<form action="/api/checkout" method="POST">
			{#each localBasket.items as item (item.id)}
				<input type="hidden" name={item.priceId} value={item.quantity} />
			{/each}

			<div class="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8">
				<a href="/" class="btn">
					Continue shopping
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
					>
						<path
							d="M8.25324 5.49609L13.7535 10.9963L8.25 16.4998"
							stroke="#4F46E5"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
				{#if session?.user !== undefined}
					<button
						type="submit"
						class="btn btn-primary"
						disabled={localBasket.items && localBasket.items.length === 0}
						>Continue to Payment
						<svg
							class="ml-2"
							xmlns="http://www.w3.org/2000/svg"
							width="23"
							height="22"
							viewBox="0 0 23 22"
							fill="none"
						>
							<path
								d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998"
								stroke="white"
								stroke-width="1.6"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				{:else}
					<p>You must sign in to checkout</p>
				{/if}
			</div>
		</form>
	</div>
</section>
