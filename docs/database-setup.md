# Database Setup

Databases are stored in Supabase. The auth table for signing up and logging in users is created automatically when you set up Supabase Auth.

## Initial Setup

To add the tables for recording their active subscriptions and bought products, as well as products and prices, you can use the SQL scripts from the `supabase/migrations` folder in the Supabase SQL Editor.

## Common commands for local development

- `npx supabase start` - Start the local Supabase instance
- `npx supabase stop` - Stop the local Supabase instance
- `npx supabase db reset` - Reset the local database
- `npx supabase gen types typescript --local > src/lib/types/supabase.d.ts` - Generate types for the local database

## Generating Types

To get the types for the tables, you can follow these instructions taken from [here](https://supabase.com/docs/guides/api/rest/generating-types#generating-types-using-supabase-cli):

`npm i supabase@">=1.8.1" --save-dev`

`npx supabase login`

`npx supabase init`

Replace `$PROJECT_REF` with your project reference and replace `types/supabase.d.ts` with whatever file you want your types in:
`npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/lib/types/supabase.d.ts`

If you are using a local Supabase instance, you can use the following command to generate the types:
`npx supabase gen types typescript --local > src/lib/types/supabase.d.ts`

## Local DB Development

Ensure you have [Docker](https://docs.docker.com/get-docker/) installed and running.

You can start and stop the local DB environment with:

```bash
npx supabase start

npx supabase stop
```

This will start the local DB and email monitoring services. You can access the web interfaces for the local DB at [http://localhost:54323/](http://localhost:54323/) and the email monitoring at [http://localhost:54324/](http://localhost:54324/).It will also give you the API URL, anon key and service_role key to put in your `.env` file for local development.

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

To do so without resetting the database, you can use the following command:

`npx supabase migration up`

> Use this command when you want to preserve existing data whilst applying new schema changes. For a fresh start with test data, use `npx supabase db reset` instead.

And for the database in the cloud:

`npx supabase db push`

> Prerequisite login using `npx supabase login`

`npx supabase db reset --linked`

## Enabling sending emails with Brevo

1. Go to the Project Settings in Supabase, then Authentication, then SMTP Settings. You should end up at `https://supabase.com/dashboard/project/[your-project-here]/settings/auth`
2. Enable custom SMTP and fill in the required fields with your Brevo credentials.

- You need to have an email address that you can send stuff from
- You need to have a Brevo account
- sender email as noreply@yourdomain.com

3. `https://app.brevo.com/senders/list` to add senders
4. Add a sender for noreply@yourdomain.com
5. Verify your email domain via DKIM or DMARC
6. In Brevo go to `https://app.brevo.com/settings/keys/smtp` to see your SMTP credentials.
7. Fill in the SMTP credentials in Supabase.
8. Go to `https://supabase.com/dashboard/project/[your-project-here]/auth/url-configuration`
9. Add these redirect URLs:

- `http://localhost:3000`
- `http://localhost:3000/**`
- `https://www.your-domain.com`
- `https://your-domain.com`
- `http://localhost:5173`
- `http://localhost:5173/**`
- Add your netlify.app domain here with **-- at the start, e.g. `http://**--your-netlify-app.netlify.app`
