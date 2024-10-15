<script lang="ts">
	import { onMount } from 'svelte';
	import { debounce } from 'ts-debounce';
	import ProductsListItem from '$lib/components/products/ProductsListItem.svelte';

	let products = [] as any[];
	let enablePagination = false;
	let totalPages = 1;
	let currentPage = 1;
	const limit = 20;
	let isLoading = false;
	let errorMessage = '';

	// Debounced fetchProducts function to prevent rapid requests
	const fetchProducts = debounce(async (page: number) => {
		isLoading = true;
		errorMessage = '';

		// Ensure page number is within valid range
		if (page < 1) {
			page = 1;
		} else if (page > totalPages) {
			page = totalPages;
		}

		const offset = (page - 1) * limit;

		try {
			const response = await fetch(`/products?limit=${limit}&offset=${offset}`);
			const responseJson = await response.json();

			if (response.ok) {
				products = responseJson.products;
				const count = responseJson.count;

				totalPages = Math.ceil(count / limit);
				enablePagination = totalPages > 1;
				currentPage = page;
			} else {
				throw new Error(responseJson.error || 'Failed to load products.');
			}
		} catch (error) {
			console.error(error);
			errorMessage = error.message || 'Failed to load products.';
		} finally {
			isLoading = false;
		}
	}, 300); // 300ms debounce delay

	onMount(() => {
		fetchProducts(currentPage);
	});

	// Generate pagination buttons with ellipsis for large numbers of pages
	function getPageNumbers() {
		const maxButtons = 5;
		const pageNumbers = [];

		if (totalPages <= maxButtons) {
			// Show all pages as there aren't many
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			let startPage = Math.max(currentPage - 2, 1);
			let endPage = Math.min(currentPage + 2, totalPages);

			if (currentPage <= 3) {
				startPage = 1;
				endPage = maxButtons;
			} else if (currentPage >= totalPages - 2) {
				startPage = totalPages - (maxButtons - 1);
				endPage = totalPages;
			}

			// Add first page and ellipsis if needed
			if (startPage > 1) {
				pageNumbers.push(1);
				if (startPage > 2) {
					pageNumbers.push('...');
				}
			}

			// Add page numbers
			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			// Add ellipsis and last page if needed
			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					pageNumbers.push('...');
				}
				pageNumbers.push(totalPages);
			}
		}

		return pageNumbers;
	}

	function handlePageClick(pageNumber: number | string) {
		if (typeof pageNumber === 'number' && pageNumber !== currentPage) {
			fetchProducts(pageNumber);
		}
	}
</script>

<section class="py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-manrope font-bold text-3xl min-[400px]:text-4xl text-black mb-8 max-lg:text-center"
		>
			Available Products
		</h2>

		{#if isLoading}
			<p class="loading">Loading products...</p>
		{:else if errorMessage}
			<p class="error">{errorMessage}</p>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{#each products as product (product.id)}
					<ProductsListItem {product} />
				{/each}
			</div>

			{#if enablePagination}
				<div class="flex justify-center mt-12">
					<div class="join">
						<!-- Previous Button -->
						<button
							class="join-item btn"
							on:click={() => fetchProducts(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Previous
						</button>

						<!-- Page Number Buttons -->
						{#each getPageNumbers() as pageNumber}
							{#if pageNumber === '...'}
								<span class="join-item btn">...</span>
							{:else}
								<button
									class="join-item btn {currentPage === pageNumber ? 'btn-active' : ''}"
									on:click={() => handlePageClick(pageNumber)}
								>
									{pageNumber}
								</button>
							{/if}
						{/each}

						<!-- Next Button -->
						<button
							class="join-item btn"
							on:click={() => fetchProducts(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	.loading {
		text-align: center;
		margin: 20px 0;
	}
	.error {
		color: red;
		text-align: center;
		margin: 20px 0;
	}
</style>
