<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let name = '';
	let email = '';
	let message = '';
	let submitted = false;
	let error = '';

	const handleSubmit: SubmitFunction = () => {
		let loading = false;
		return async ({ result, update }) => {
			loading = true;
			if (result.data && result.data.success) {
				submitted = true;
			} else {
				error = result.error?.message || 'Form submission failed';
			}
			loading = false;
			await update();
		};
	};
</script>

{#if submitted}
	<div class="alert alert-success shadow-lg">
		<div>
			<span>Thank you for your message, {name}!</span>
		</div>
	</div>
{:else}
	<form
		method="post"
		action="?"
		use:enhance={handleSubmit}
		class="max-w-lg mx-auto p-4 bg-base-200 rounded-lg shadow-md"
		aria-labelledby="contact-form-title"
	>
		<h2 id="contact-form-title" class="text-xl font-bold mb-4">Contact Us</h2>
		{#if error}
			<div class="alert alert-error shadow-lg mb-4">
				<div>
					<span>{error}</span>
				</div>
			</div>
		{/if}
		<div class="form-control mb-4">
			<label for="name" class="label">
				<span class="label-text">Name *</span>
			</label>
			<input
				id="name"
				name="name"
				type="text"
				bind:value={name}
				class="input input-bordered"
				aria-required="true"
				minlength="2"
				maxlength="100"
				required
			/>
		</div>

		<div class="form-control mb-4">
			<label for="email" class="label">
				<span class="label-text">Email *</span>
			</label>
			<input
				id="email"
				name="email"
				type="email"
				bind:value={email}
				class="input input-bordered"
				aria-required="true"
				minlength="5"
				maxlength="100"
				required
			/>
		</div>

		<div class="form-control mb-4">
			<label for="message" class="label">
				<span class="label-text">Message *</span>
			</label>
			<textarea
				id="message"
				name="message"
				bind:value={message}
				class="textarea textarea-bordered"
				aria-required="true"
				minlength="10"
				maxlength="1000"
				required
			></textarea>
			<small class="text-sm mt-1">Maximum 1000 characters</small>
		</div>

		<div class="form-control">
			<button type="submit" class="btn btn-primary">Send</button>
		</div>
	</form>
{/if}
