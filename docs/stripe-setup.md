# Stripe webhook event listening

> First ensure you've installed the [Stripe CLI](https://docs.stripe.com/stripe-cli)

Log in using the stripe CLI:

```bash
stripe login
```

Obtain your Webhook signing secret:

```bash
stripe listen
```

Add the secret key to to your .env(.local):

`PUBLIC_STRIPE_ENDPOINT_SECRET`

### Testing the webhook locally

You can use the [Stripe CLI to forward events to your local server](https://docs.stripe.com/webhooks):

```bash
stripe listen --forward-to localhost:5173/api/webhook/stripe
```

To disable HTTPS certificate verification, use the --skip-verify optional flag.

```bash
stripe listen --forward-to localhost:5173/api/webhook/stripe --skip-verify
```

TODO - Add instructions for what else to do to get the webhook working locally.
