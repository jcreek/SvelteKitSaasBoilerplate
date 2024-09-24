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

`STRIPE_ENDPOINT_SECRET`

## Testing the webhook locally

You can use the [Stripe CLI to forward events to your local server](https://docs.stripe.com/webhooks):

```bash
stripe listen --forward-to localhost:5173/api/webhook/stripe
```

To disable HTTPS certificate verification, use the --skip-verify optional flag.

```bash
stripe listen --forward-to localhost:5173/api/webhook/stripe --skip-verify
```

## Purchaseable products

As well as subscriptions you can also create purchaseable products in Stripe. These can be used for one-off payments or for products that are not subscription based. To add these to the application you can follow the example product's pattern.

There is a config value `VITE_PRODUCT_ID_EXAMPLEPRODUCT` that is used to identify the product in the Stripe checkout session. This is the product code from Stripe. The actual 'product' that users are getting access to is at the `src/routes/tools/exampleproduct` path.
