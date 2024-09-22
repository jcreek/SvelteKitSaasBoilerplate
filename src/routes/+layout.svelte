<script lang="ts">
	import '../app.postcss';
	import { onDestroy, onMount } from 'svelte';
	import { isBrowser } from '@supabase/ssr';
	import { basket, type Basket, type Item } from '$lib/stores/basket.js';
	import { general } from '$lib/stores/generalStore.js';
	import { invalidate } from '$app/navigation';
	import SignOut from '$lib/components/SignOut.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import NavLinks from '$lib/components/NavLinks.svelte';
	import MagicLink from '$lib/components/MagicLink.svelte';

	export let data;
	let { supabase, session, url } = data;
	$: ({ supabase, session, url } = data);

	let localBasket: Basket;
	const unsubscribeToBasket = basket.subscribe((value) => {
		localBasket = value;
	});

	let localGeneral: any;
	const unsubscribeToGeneralStore = general.subscribe((value) => {
		localGeneral = value;
	});

	onDestroy(() => {
		unsubscribeToBasket();
		unsubscribeToGeneralStore();
	});

	let cookiesAccepted = false;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				// tells SvelteKit that the root +layout.ts load function should be executed whenever the session updates to keep the page store in sync.
				invalidate('supabase:auth');
			}
		});

		if (isBrowser()) {
			if (localStorage.getItem('cookiesAccepted')) {
				cookiesAccepted = true;
			}
		}

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<meta name="description" content="" />
	<meta property="og:title" content="" />
	<meta property="og:url" content="" />
	<meta property="og:description" content="" />
	<link rel="canonical" href="" />
	<!-- <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> -->

	{#if cookiesAccepted}
		<!-- Google Analytics script goes here -->
	{/if}
</svelte:head>

<header>
	<nav class="navbar bg-primary text-primary-content">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/></svg
					>
				</div>
				<ul
					class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-base-content rounded-box w-52"
				>
					<NavLinks isMobile={true} />
				</ul>
			</div>
			<a href="/" class="btn btn-ghost text-xl">SvelteKit SaaS Boilerplate</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<NavLinks isMobile={false} />
			</ul>
		</div>
		<div class="navbar-end">
			<a href="/checkout" class="btn btn-ghost btn-circle">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
						/></svg
					>
					<span class="badge badge-sm indicator-item">{localBasket.items.length}</span>
				</div>
			</a>
			<details class="dropdown dropdown-end">
				<summary tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						{#if session?.user}
							<div class="user-circle text-primary-content border-primary-content">
								{session?.user.email[0].toUpperCase()}
							</div>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</div>
				</summary>

				{#if session?.user}
					<ul
						tabindex="-1"
						class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box min-w-[13rem] w-auto"
					>
						<li>
							<a href="/account"> Account </a>
						</li>
						<li><a href="/settings">Settings</a></li>
						<li><SignOut {supabase} /></li>
					</ul>
				{:else}
					<div
						class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box min-w-[13rem] w-auto"
					>
						<MagicLink {supabase} />
					</div>
				{/if}
			</details>
		</div>
	</nav>
</header>

<main>
	<slot />
</main>

<CookieConsent {cookiesAccepted} />

<footer class="footer items-center p-4 bg-neutral text-neutral-content">
	<aside class="items-center grid-flow-col">
		<svg
			width="36"
			height="36"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			fill-rule="evenodd"
			clip-rule="evenodd"
			class="fill-current"
		>
			<path
				d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
			></path>
		</svg>
		<p>Copyright © 2024 - All right reserved</p>
	</aside>
	<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
		<a href="/">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class="fill-current"
				><path
					d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
				></path>
			</svg>
		</a>
		<a href="/"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class="fill-current"
				><path
					d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
				></path>
			</svg>
		</a>
		<a href="/">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class="fill-current"
				><path
					d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
				></path>
			</svg>
		</a>
	</nav>
</footer>

<div
	id={localGeneral.toastType == 'success' ? 'success-toast' : 'error-toast'}
	role="alert"
	class="alert {localGeneral.toastType == 'success'
		? 'alert-success'
		: 'alert-error'} fixed top-20 right-3 max-w-52 text-white {localGeneral.hideToast
		? 'hidden'
		: ''}"
>
	{#if localGeneral.toastType == 'success'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
	{:else}
		<svg
			class="stroke-current shrink-0 h-6 w-6"
			viewBox="0 0 32 32"
			xml:space="preserve"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			><g
				><g id="Error_1_"
					><g id="Error">
						<circle cx="16" cy="16" id="BG" r="16" style="fill:#E6E6E6;" />
						<path
							d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z"
							id="Exclamatory_x5F_Sign"
							style="fill:#D72828;"
						/>
					</g>
				</g></g
			></svg
		>
	{/if}

	<span>{localGeneral.toastMessage == '' ? 'Added to basket' : localGeneral.toastMessage}</span>
</div>

<style scoped lang="postcss">
	.user-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid;
		/* background-color: red; */
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px; /* Adjust font size as needed */
	}

	main {
		min-height: calc(100dvh - 68px - 68px);
	}
</style>
