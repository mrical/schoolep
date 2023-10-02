import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

let stripePromise;
const stripe = new Stripe(process.env.STRIPE_SK);
const initializeStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_PK);
  }
  return stripePromise;
};

export { stripe, initializeStripe };
