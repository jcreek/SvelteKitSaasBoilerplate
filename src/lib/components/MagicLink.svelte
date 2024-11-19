<script lang="ts">
	import { scheduleToast } from '$lib/stores/toastStore.js';
	export let supabase: any;
	const SUCCESS_MESSAGE = 'Check your email for the magic link.';

	let loading = false,
		email = '';

	async function submit() {
		loading = true;

		const { error: err } = await supabase.auth.signInWithOtp({ email });

		if (err) scheduleToast(err.message, 'error', 5000);
		else scheduleToast(SUCCESS_MESSAGE, 'success', 5000);

		loading = false;
	}
</script>

<div class="p-4">
	<div class="component">
		<div class="container">
			<form on:submit|preventDefault={submit}>
				<label class="input input-bordered flex items-center gap-2">
					Email
					<input
						type="text"
						name="email"
						class="grow"
						placeholder="Your email address"
						bind:value={email}
					/>
				</label>
				<button class="btn btn-active btn-primary w-full" on:click disabled={loading}
					>Send magic link</button
				>
			</form>
		</div>
	</div>
</div>

<style>
	.component {
		width: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;
	}
</style>
