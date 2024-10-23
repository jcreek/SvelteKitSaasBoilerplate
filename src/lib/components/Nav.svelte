<script lang="ts">
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import MagicLink from './MagicLink.svelte';
	import NavLinks from './NavLinks.svelte';
	import SignOut from './SignOut.svelte';
	import Dropdown from './Dropdown.svelte';
	import { basket, type Basket } from '$lib/stores/basket.js';
	import { onDestroy } from 'svelte';

	export let session: Session | null;
	export let supabase: SupabaseClient<any, 'public', any>;

	let localBasket: Basket;
	const unsubscribeToBasket = basket.subscribe((value) => {
		localBasket = value;
	});

	onDestroy(() => {
		unsubscribeToBasket();
	});
</script>

<nav class="bg-primary text-primary-content p-4">
	<div class="container mx-auto flex justify-between items-center">
		<!-- Hamburger Menu Button (Mobile) -->
		<div class="lg:hidden mr-4">
			<Dropdown>
				<div slot="dropdown">
					<button class="block text-white focus:outline-none">
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							></path>
						</svg>
					</button>
				</div>
				<!-- Dropdown content -->
				<NavLinks isMobile />
			</Dropdown>
		</div>
		<a href="/" class="text-white font-bold text-xl">SvelteKit SaaS Boilerplate</a>
		<div class="hidden lg:block">
			<NavLinks />
		</div>
		<!-- Right Side: Basket & User Account -->
		<div class="flex items-center space-x-4">
			<!-- Basket/Checkout Icon -->
			<a href="/checkout" class="btn btn-ghost btn-circle hidden lg:flex">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					{#if localBasket.items.length > 0}
						<span class="badge badge-sm indicator-item">{localBasket.items.length}</span>
					{/if}
				</div>
			</a>
			<!-- User Account Dropdown -->
			<Dropdown posRight>
				<div slot="dropdown">
					<div class="btn btn-ghost btn-circle avatar placeholder">
						<div class="w-10 rounded-full">
							{#if session?.user}
								<div class="user-circle text-primary-content border-primary-content">
									<span class="text-xl"
										>{session?.user.email ? session?.user.email[0].toUpperCase() : '?'}</span
									>
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
					</div>
				</div>
				<!-- Dropdown content -->
				{#if session?.user}
					<li class="lg:hidden">
						<a href="/checkout">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							Basket
							{#if localBasket.items.length > 0}
								<span class="badge badge-md indicator-item bg-primary text-primary-content"
									>{localBasket.items.length}</span
								>
							{/if}
						</a>
					</li>
					<li><a href="/account">Account</a></li>
					<li><a href="/settings">Settings</a></li>
					<li><SignOut {supabase} /></li>
				{:else}
					<MagicLink {supabase} />
				{/if}
			</Dropdown>
		</div>
	</div>
</nav>
