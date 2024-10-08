# SvelteKit Saas Boilerplate

A SvelteKit boilerplate project for a Software As A Service (SaaS) application, to get you started quickly.

[![Netlify Status](https://api.netlify.com/api/v1/badges/70e20d6a-2d2c-4a5b-b697-8053c1e8655b/deploy-status)](https://app.netlify.com/sites/sveltekitsaasboilerplate/deploys)

## Developing

After you have cloned the repository you can install the dependencies with `npm install`, and start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

An example `.env` file is provided in the repository. You will need to copy `.env.example` to `.env` and fill in the values with your own credentials.

If you want a fully local development environment (other than stripe) then you can follow the instructions in the [database setup](/docs/database-setup.md) document and make use of the local supabase instance and a local email service.

- [Local DB Url](http://localhost:54323/)
- [Local Email Monitoring Url](http://localhost:54324/)

For stripe, you can forward the events to your local server using `stripe listen --forward-to localhost:5173/api/webhook/stripe --skip-verify` in a separate terminal window.

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Hosting and Tech Stack

This application is designed to run on [Netlify](https://www.netlify.com/) and uses [Supabase](https://supabase.io/) for database storage and user authentication ([Supabase Auth](https://supabase.com/auth)).

The application is written in Typescript using the [SvelteKit](https://kit.svelte.dev/) framework.

For styling, the application uses [Tailwind CSS](https://tailwindcss.com/) with the [DaisyUI](https://daisyui.com/) component library and [HyperUI](https://www.hyperui.dev/).

For taking payments the Stripe Checkout is used.

In its current configuration, the application can be easily linked to Netlify via git for CI/CD, enabling automatic deployments on push to the main branch.

## To Do

- [Update types automatically](https://supabase.com/docs/guides/api/rest/generating-types#update-types-automatically-with-github-actions)

Please see the Issues tab for `enhancement` tagged issues.

## [Database setup](/docs/database-setup.md)

## [Stripe webhook event listening](/docs/stripe-setup.md)

## Testing the example credits management system

There is an example system in this project for being able to manage credits that are sold to users. To test this system you can visit the `http://localhost:5173/test/test-credits` route. This will allow you to add credits to a user and then spend them by clicking the buttons on the page, and will show the user's credit balance updating in real time.
