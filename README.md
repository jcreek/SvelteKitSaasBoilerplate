# SvelteKit Saas Boilerplate

A SvelteKit boilerplate project for a Software As A Service (SaaS) application, to get you started quickly.

## Developing

After you have cloned the repository you can install the dependencies with `npm install`, and start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

An example `.env` file is provided in the repository. You will need to copy `.env.example` to `.env` and fill in the values with your own credentials.

### Local DB Development

Ensure you have [Docker](https://docs.docker.com/get-docker/) installed on your development machine.

You can start and stop the local DB environment with:

```bash
npx supabase start

npx supabase stop
```

#### Migrations

There are two options to create a migration file:

1. [Writing the SQL manually](https://supabase.com/docs/guides/cli/local-development#database-migrations)

    - Create new blank migration file

      ```bash
      npx supabase migration new <migration_name>
      ```

    - Add the SQL you want to deploy as part of the migration e.g.

      ```sql
      create table
      employees (
      id bigint primary key generated always as identity,
      name text,
      email text,
      created_at timestamptz default now()
      );
      ```

    - Reset the DB and apply the latest migrations

      ```bash
      supabase db reset
      ```

2. [Generate SQL based on differences to the schema](https://supabase.com/docs/guides/cli/local-development#diffing-changes)

   - With the local DB running, enter the studio and make your changes to the schema

   - Generate the migration file containing the SQL with the differences in the schema

      ```bash
      npx supabase db diff -f <migration_name>
      ```

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

Please see the Issues tab for `enhancement` tagged issues.
