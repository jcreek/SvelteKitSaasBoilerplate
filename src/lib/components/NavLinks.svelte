<script lang="ts">
	export let isMobile: boolean = false;
</script>

<li><a href="/products">Products</a></li>
<li class={isMobile ? '' : 'dropdown'}>
	{#if isMobile}
		<div tabindex="0" role="button" class="">Parent</div>
	{:else}
		<details>
			<summary>Parent</summary>
		</details>
	{/if}
	<ul
		class="{isMobile
			? ''
			: 'dropdown-content rounded-box w-52 shadow'} z-[1] menu p-2 bg-base-100 text-base-content"
	>
		<li><a href="/">Submenu 1</a></li>
		<li><a href="/">Submenu 2</a></li>
	</ul>
</li>
<li><a href="/tools/exampleproduct">Example Product</a></li>
