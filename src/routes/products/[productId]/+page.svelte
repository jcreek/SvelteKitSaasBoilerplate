<script lang="ts">
	import { onDestroy } from 'svelte';
	import { redirect } from '@sveltejs/kit';
	import { basket, type Basket, type Item } from '$lib/stores/basket.js';
	import { general } from '$lib/stores/generalStore.js';

	/** @type {import('./$types').PageData} */
	export let data;

	let { supabase, session, hasPurchasedProduct, item } = data;
	$: ({ supabase, session, hasPurchasedProduct, item } = data);

	let localBasket: Basket;
	const unsubscribeToBasket = basket.subscribe((value) => {
		localBasket = value;
	});

	onDestroy(() => {
		unsubscribeToBasket();
	});

	function addToBasket() {
		if (!session) {
			redirect(303, '/');
		}
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

		general.update((value) => {
			return { ...value, hideToast: false };
		});

		setTimeout(() => {
			general.update((value) => {
				return { ...value, hideToast: true };
			});
		}, 5000);
	}

	function startSubscription() {
		fetch('/api/subscribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ priceId: item.priceId })
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
			});
	}
</script>

<section class="relative">
	<div class="w-full mx-auto px-4 sm:px-6 lg:px-0">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">
			<div class="img">
				<div class="img-box h-full max-lg:mx-auto">
					<img src={item.imgSrc} alt={item.imgAlt} class="max-lg:mx-auto lg:ml-auto h-full" />
				</div>
			</div>
			<div
				class="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0"
			>
				<div class="data w-full max-w-xl">
					<h2 class="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2 capitalize">
						{item.name}
					</h2>
					<div class="flex flex-col sm:flex-row sm:items-center mb-6">
						<h6
							class="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5"
						>
							£{item.price} {item.isSubscription ? `/ ${item.interval}` : ''}
						</h6>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-1">
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_12029_1640)">
										<path
											d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
											fill="#FBBF24"
										/>
									</g>
									<defs>
										<clipPath id="clip0_12029_1640">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_12029_1640)">
										<path
											d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
											fill="#FBBF24"
										/>
									</g>
									<defs>
										<clipPath id="clip0_12029_1640">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_12029_1640)">
										<path
											d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
											fill="#FBBF24"
										/>
									</g>
									<defs>
										<clipPath id="clip0_12029_1640">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_12029_1640)">
										<path
											d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
											fill="#FBBF24"
										/>
									</g>
									<defs>
										<clipPath id="clip0_12029_1640">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_8480_66029)">
										<path
											d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
											fill="#F3F4F6"
										/>
									</g>
									<defs>
										<clipPath id="clip0_8480_66029">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</div>
							<span class="pl-2 font-normal leading-7 text-gray-500 text-sm">1624 reviews</span>
						</div>
					</div>
					<p class="text-gray-500 text-base font-normal mb-5">
						{item.categoryDescription}
					</p>
					<ul class="grid gap-y-4 mb-8">
						<li class="flex items-center gap-3">
							<svg
								width="26"
								height="26"
								viewBox="0 0 26 26"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="26" height="26" rx="13" fill="#4F46E5" />
								<path
									d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
									stroke="white"
									stroke-width="1.6"
									stroke-linecap="round"
								/>
							</svg>
							<span class="font-normal text-base text-gray-900">Branded shirt</span>
						</li>
						<li class="flex items-center gap-3">
							<svg
								width="26"
								height="26"
								viewBox="0 0 26 26"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="26" height="26" rx="13" fill="#4F46E5" />
								<path
									d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
									stroke="white"
									stroke-width="1.6"
									stroke-linecap="round"
								/>
							</svg>
							<span class="font-normal text-base text-gray-900">3 color shirt</span>
						</li>
						<li class="flex items-center gap-3">
							<svg
								width="26"
								height="26"
								viewBox="0 0 26 26"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="26" height="26" rx="13" fill="#4F46E5" />
								<path
									d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
									stroke="white"
									stroke-width="1.6"
									stroke-linecap="round"
								/>
							</svg>
							<span class="font-normal text-base text-gray-900"
								>Pure Cotton Shirt with 60% as 40%</span
							>
						</li>
						<li class="flex items-center gap-3">
							<svg
								width="26"
								height="26"
								viewBox="0 0 26 26"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="26" height="26" rx="13" fill="#4F46E5" />
								<path
									d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
									stroke="white"
									stroke-width="1.6"
									stroke-linecap="round"
								/>
							</svg>
							<span class="font-normal text-base text-gray-900">all size is available</span>
						</li>
					</ul>

					{#if !item.isSubscription && !hasPurchasedProduct}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8">
							<div class="flex sm:items-center sm:justify-center w-full">
								<button
									class="group py-4 px-6 border border-gray-400 rounded-l-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
								>
									<svg
										class="stroke-gray-900 group-hover:stroke-black"
										width="22"
										height="22"
										viewBox="0 0 22 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M16.5 11H5.5" stroke="" stroke-width="1.6" stroke-linecap="round" />
										<path
											d="M16.5 11H5.5"
											stroke=""
											stroke-opacity="0.2"
											stroke-width="1.6"
											stroke-linecap="round"
										/>
										<path
											d="M16.5 11H5.5"
											stroke=""
											stroke-opacity="0.2"
											stroke-width="1.6"
											stroke-linecap="round"
										/>
									</svg>
								</button>
								<input
									type="text"
									class="font-semibold text-gray-900 cursor-pointer text-lg py-[13px] px-6 w-full sm:max-w-[118px] outline-0 border-y border-gray-400 bg-transparent placeholder:text-gray-900 text-center hover:bg-gray-50"
									placeholder="1"
								/>
								<button
									class="group py-4 px-6 border border-gray-400 rounded-r-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
								>
									<svg
										class="stroke-gray-900 group-hover:stroke-black"
										width="22"
										height="22"
										viewBox="0 0 22 22"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M11 5.5V16.5M16.5 11H5.5"
											stroke="#9CA3AF"
											stroke-width="1.6"
											stroke-linecap="round"
										/>
										<path
											d="M11 5.5V16.5M16.5 11H5.5"
											stroke="black"
											stroke-opacity="0.2"
											stroke-width="1.6"
											stroke-linecap="round"
										/>
										<path
											d="M11 5.5V16.5M16.5 11H5.5"
											stroke="black"
											stroke-opacity="0.2"
											stroke-width="1.6"
											stroke-linecap="round"
										/>
									</svg>
								</button>
							</div>
							<button
								class="group py-4 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-indigo-100"
								on:click={addToBasket}
							>
								<svg
									class="stroke-indigo-600"
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10.7394 17.875C10.7394 18.6344 10.1062 19.25 9.32511 19.25C8.54402 19.25 7.91083 18.6344 7.91083 17.875M16.3965 17.875C16.3965 18.6344 15.7633 19.25 14.9823 19.25C14.2012 19.25 13.568 18.6344 13.568 17.875M4.1394 5.5L5.46568 12.5908C5.73339 14.0221 5.86724 14.7377 6.37649 15.1605C6.88573 15.5833 7.61377 15.5833 9.06984 15.5833H15.2379C16.6941 15.5833 17.4222 15.5833 17.9314 15.1605C18.4407 14.7376 18.5745 14.0219 18.8421 12.5906L19.3564 9.84059C19.7324 7.82973 19.9203 6.8243 19.3705 6.16215C18.8207 5.5 17.7979 5.5 15.7522 5.5H4.1394ZM4.1394 5.5L3.66797 2.75"
										stroke=""
										stroke-width="1.6"
										stroke-linecap="round"
									/>
								</svg>
								Add to basket
							</button>
						</div>
					{:else}
						{#if hasPurchasedProduct}
							<div class="flex items-center gap-3">
								<button
									class="group text-center w-full py-4 px-5 rounded-full bg-gray-100 text-gray-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500"
									disabled
								>
									You already own this
								</button>
							</div>
						{/if}
						{#if item.isSubscription}
							<div class="flex items-center gap-3">
								<button
									class="text-center w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400"
									on:click={startSubscription}
								>
									Subscribe
								</button>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>
