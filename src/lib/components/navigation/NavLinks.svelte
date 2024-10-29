<script lang="ts">
	import { type NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import type { Session } from '@supabase/supabase-js';
	import NavLinkParent from './NavLinkParent.svelte';
	import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';

    export let session: Session | null;
    export let supabase: SupabaseClient | null = null;
	export let isMobile = false;

    const userAccountLinks: NavLinkItem[] = [];

    if (isMobile) {
        if (session) {
            userAccountLinks.push(
                {
                    text: 'User', // TODO - replace with user's name - will require a database call to get the user's name - suggest setting up a user model to store user data.
                    isParent: true,
                    isUserAccount: true,
                    children: [
                        {
                            text: 'Account',
                            href: '/account'
                        },
                        {
                            text: 'Sign Out',
                            isSignout: true
                        }
                    ]
                }
            );
        } else {
            userAccountLinks.push(
                {
                    text: 'Log in',
                    href: '/login'
                },
            );
        }
    }

	const links: NavLinkItem[] = [
        ...userAccountLinks,
		{
			text: 'Products',
			href: '/products'
		},
		{
			text: 'Parent',
			isParent: true,
			children: [
				{
					text: 'Submenu 1',
					href: '/'
				},
				{
					text: 'Submenu 2',
					href: '/'
				}
			]
		},
		{
			text: 'Example Product',
			href: '/tools/exampleproduct'
		}
	];
</script>

<ul class:flex={!isMobile} class:space-x-4={!isMobile}>
	{#each links as link}
		<li class:md:hidden={link.isUserAccount}>
			{#if link.isParent}
				<NavLinkParent linkItem={link} {isMobile} {supabase} />
			{:else}
				<a href={link.href}>{link.text}</a>
			{/if}
		</li>
	{/each}
</ul>
