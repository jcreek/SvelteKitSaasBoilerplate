<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let name = '';
	let email = '';
	let message = '';
	let submitted = false;
	let error = '';

	const handleSubmit: SubmitFunction = ({}) => {
		return async ({ result, update }) => {
			if (result.data.success) {
				submitted = true;
			} else {
				error = result.error?.message || 'Form submission failed';
			}
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
	>
		{#if error}
			<div class="alert alert-error shadow-lg mb-4">
				<div>
					<span>{error}</span>
				</div>
			</div>
		{/if}
		<div class="form-control mb-4">
			<label for="name" class="label">
				<span class="label-text">Name</span>
			</label>
			<input
				id="name"
				name="name"
				type="text"
				bind:value={name}
				class="input input-bordered"
				required
			/>
		</div>

		<div class="form-control mb-4">
			<label for="email" class="label">
				<span class="label-text">Email</span>
			</label>
			<input
				id="email"
				name="email"
				type="email"
				bind:value={email}
				class="input input-bordered"
				required
			/>
		</div>

		<div class="form-control mb-4">
			<label for="message" class="label">
				<span class="label-text">Message</span>
			</label>
			<textarea
				id="message"
				name="message"
				bind:value={message}
				class="textarea textarea-bordered"
				required
			></textarea>
		</div>

		<div class="form-control">
			<button type="submit" class="btn btn-primary">Send</button>
		</div>
	</form>
{/if}
