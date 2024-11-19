<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	export let cookiesAccepted;
	let showBanner = false;

	onMount(() => {
		if (!cookiesAccepted) {
			const storedValue = localStorage.getItem('cookiesAccepted');
			showBanner = storedValue !== 'true';
		}
	});

	const acceptCookies = () => {
		localStorage.setItem('cookiesAccepted', 'true');
		showBanner = false;
	};
</script>

{#if showBanner}
	<div
		class="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4"
		transition:slide={{ duration: 200, easing: cubicInOut }}
	>
		<p class="text-sm">
			We use cookies to ensure you get the best experience on our website. By continuing, you agree
			to our use of cookies. For details, please see our <a href="/privacy" class="underline"
				>Privacy Policy</a
			>.
		</p>
		<button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded" on:click={acceptCookies}
			>Accept</button
		>
	</div>
{/if}
