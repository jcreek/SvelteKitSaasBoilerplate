<script lang="ts">
	import { onMount } from 'svelte';
	import { isBrowser } from '@supabase/ssr';

	let showBanner = false;

	const acceptCookies = () => {
		if (isBrowser()) {
			localStorage.setItem('cookiesAccepted', 'true');
			showBanner = false;
		}

		location.reload();
	};

	let cookiesAccepted = false;

	onMount(() => {
		if (isBrowser()) {
			if (localStorage.getItem('cookiesAccepted')) {
				cookiesAccepted = true;
			}
		}
	});
</script>

{#if !cookiesAccepted}
	<div class="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4">
		<p class="text-sm">
			We use cookies to ensure you get the best experience on our website. By continuing, you agree
			to our use of cookies.
		</p>
		<button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded" on:click={acceptCookies}
			>Accept</button
		>
	</div>
{/if}
