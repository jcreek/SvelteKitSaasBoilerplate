import Stripe from 'stripe';

export type ProductInfo  = {
  product: Stripe.Product;
  price: Stripe.Price;
  isSubscription: boolean;
};