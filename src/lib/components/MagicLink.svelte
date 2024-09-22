<script lang="ts">
	export let supabase: any;

	let error = '',
		message = '',
		loading = false,
		email = '';

	async function submit() {
		error = '';
		message = '';
		loading = true;

		const { error: err } = await supabase.auth.signInWithOtp({ email });

		if (err) error = err.message;
		else message = 'Check your email for the magic link.';

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

				{#if message}
					<div class="text-success">
						{message}
					</div>
				{/if}

				{#if error}
					<div class="text-error">
						{error}
					</div>
				{/if}
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
