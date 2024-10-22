<script lang="ts">
	import { type NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import NavLinkParent from './NavLinkParent.svelte';

	const links: NavLinkItem[] = [
		{
			text: 'Products',
			href: '/products',
		},
		{
			text: 'Parent',
			isParent: true,
			children: [
				{
					text: 'Submenu 1',
					href: '/',
				},
				{
					text: 'Submenu 2',
					href: '/',
				},
			],
		},
		{
			text: 'Example Product',
			href: '/tools/exampleproduct',
		},
	];
</script>

<ul class="flex space-x-4">
	{#each links as link}
		<li class="relative">
			{#if link.isParent}
				<NavLinkParent text={link.text} children={link.children} />
			{:else}
				<a href={link.href}>{link.text}</a>
			{/if}
		</li>
	{/each}
</ul>
