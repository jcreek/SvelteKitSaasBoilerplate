# Database Setup

Databases are stored in Supabase. The auth table for signing up and logging in users is created automatically when you set up Supabase Auth.

## Initial Setup

To add the tables for recording their active subscriptions and bought products, as well as products and prices, you can use the SQL scripts from the `supabase/migrations` folder in the Supabase SQL Editor.

## Generating Types

To get the types for the tables, you can follow these instructions taken from [here](https://supabase.com/docs/guides/api/rest/generating-types#generating-types-using-supabase-cli):

`npm i supabase@">=1.8.1" --save-dev`

`npx supabase login`

`npx supabase init`

Replace `$PROJECT_REF` with your project reference:
`npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > types/supabase.ts`

Replace `types/supabase.d.ts` with whatever file you want your types in:
`npx supabase gen types typescript --local > types/supabase.d.ts`

## Local DB Development

Ensure you have [Docker](https://docs.docker.com/get-docker/) installed and running.

You can start and stop the local DB environment with:

```bash
npx supabase start

npx supabase stop
```

## Migrations

There are two options to create a migration file:

1. [Writing the SQL manually](https://supabase.com/docs/guides/cli/local-development#database-migrations)

   - Create new blank migration file

     `npx supabase migration new <migration_name>`

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

     `npx supabase db reset`

2. [Generate SQL based on differences to the schema](https://supabase.com/docs/guides/cli/local-development#diffing-changes)

   - With the local DB running, enter the studio and make your changes to the schema

   - Generate the migration file containing the SQL with the differences in the schema

     `npx supabase db diff -f <migration_name>`

## Applying migrations

Reset database in cloud

> Prerequisite login using `npx supabase login`

`npx supabase db reset --linked`
