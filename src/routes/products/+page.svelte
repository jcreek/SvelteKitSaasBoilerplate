<script lang="ts">
	import ProductsListItem from '$lib/components/products/ProductsListItem.svelte';
	import { onMount } from 'svelte';
	let products = [] as any;

	let enablePagination = false;

	onMount(async () => {
		const response = await fetch('/products');
		const responseJson = await response.json();
		products = responseJson.data;
		if (responseJson.has_more) {
			enablePagination = true;
		}
	});
</script>

<section class="py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-manrope font-bold text-3xl min-[400px]:text-4xl text-black mb-8 max-lg:text-center"
		>
			Available Products
		</h2>
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{#each products as product (product.id)}
				<ProductsListItem {product} />
			{/each}
		</div>
		{#if enablePagination}
			<div class="flex justify-center mt-12">
				<div class="join">
					<button class="join-item btn">1</button>
					<button class="join-item btn btn-active">2</button>
					<button class="join-item btn">3</button>
					<button class="join-item btn">4</button>
				</div>
			</div>
		{/if}
	</div>
</section>
