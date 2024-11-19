<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { onDestroy } from 'svelte';
	import { toast } from '$lib/stores/toastStore.js';
	import type { Toast } from '$lib/types/Shared/Toast';

	let localToast: Toast;
	const unsubscribeToToastStore = toast.subscribe((value: Toast) => {
		localToast = value;
	});

	onDestroy(() => {
		unsubscribeToToastStore();
	});
</script>

{#if !localToast.hideToast}
	<div
		id={localToast.toastType == 'success' ? 'success-toast' : 'error-toast'}
		role="alert"
		aria-live="polite"
		class="alert {localToast.toastType == 'success'
			? 'alert-success'
			: 'alert-error'} fixed top-20 right-3 max-w-80 z-50 text-white"
		transition:slide={{ duration: 200, easing: cubicInOut }}
	>
		{#if localToast.toastType == 'success'}
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

		<span>{localToast.toastMessage}</span>
	</div>
{/if}
