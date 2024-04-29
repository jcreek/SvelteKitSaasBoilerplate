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

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Hosting and Tech Stack

This application is designed to run on [Netlify](https://www.netlify.com/) and uses [Supabase](https://supabase.io/) for database storage and user authentication ([Supabase Auth](https://supabase.com/auth)).
