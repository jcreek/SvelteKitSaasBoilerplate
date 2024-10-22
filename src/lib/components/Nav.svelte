<script lang="ts">
	import type { Session, SupabaseClient } from "@supabase/supabase-js";
	import MagicLink from "./MagicLink.svelte";
	import NavLinks from "./NavLinks.svelte";
	import SignOut from "./SignOut.svelte";
	import { basket, type Basket } from '$lib/stores/basket.js';
	import { onDestroy } from "svelte";

  export let session: Session;
  export let supabase: SupabaseClient<any, "public", any>;

  let isMobileMenuOpen = false;

  function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

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
    <button on:click={toggleMobileMenu} class="block md:hidden text-white focus:outline-none">
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

    <a href="/" class="text-white font-bold text-xl">SvelteKit SaaS Boilerplate</a>
    <NavLinks />

    <!-- Right Side: Basket & User Account -->
    <div class="flex items-center space-x-4">
      <!-- Basket/Checkout Icon -->
      <a href="/checkout" class="btn btn-ghost btn-circle">
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
          <span class="badge badge-sm indicator-item">{localBasket.items.length}</span>
        </div>
      </a>

      <!-- User Account Dropdown -->
      <details class="dropdown dropdown-end">
        <summary tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            {#if session?.user}
              <div class="user-circle text-primary-content border-primary-content">
                {session?.user.email ? session?.user.email[0].toUpperCase() : '?'}
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
            <li><a href="/account">Account</a></li>
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
  </div>
</nav>
