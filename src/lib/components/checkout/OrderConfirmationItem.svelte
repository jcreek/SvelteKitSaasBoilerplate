<script lang="ts">
	export let imgAlt = '';
	export let imgSrc = '';
	export let itemCategoryDescription = '';
	export let itemName = '';
	export let price = 0;
	export let quantity = 0;
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-6 border-b border-gray-200 py-6">
	<div
		class="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full max-xl:justify-center max-xl:max-w-xl max-xl:mx-auto"
	>
		<div class="img-box">
			<img src={imgSrc} alt={imgAlt} class="xl:w-[140px]" />
		</div>
		<div class="pro-data w-full max-w-sm">
			<h5 class="font-semibold text-xl leading-8 text-black max-[550px]:text-center">
				{itemName}
			</h5>
			<p
				class="font-normal text-lg leading-8 text-gray-500 my-2 min-[550px]:my-3 max-[550px]:text-center"
			>
				{itemCategoryDescription}
			</p>

			<div class="flex items-center">
				<h6
					class="font-medium text-lg leading-8 text-indigo-600 max-[550px]:text-center pr-4 mr-4 border-r border-gray-200"
				>
					£ {price.toFixed(2)}
				</h6>
				<p class="font-medium text-base leading-7 text-black">
					Qty: <span class="text-gray-500">{quantity}</span>
				</p>
			</div>
		</div>
	</div>
	<div
		class="flex items-center flex-col min-[550px]:flex-row w-full max-xl:max-w-xl max-xl:mx-auto gap-2"
	>
		<div class="flex items-center w-full mx-auto justify-center"></div>
		<h6
			class="text-indigo-600 font-manrope font-bold text-2xl leading-9 w-full max-w-[176px] text-center"
		>
			£{(price * quantity).toFixed(2)}
		</h6>
	</div>
</div>
