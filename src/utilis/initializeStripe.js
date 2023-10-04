import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

let stripePromise;
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SK);
const initializeStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);
  }
  return stripePromise;
};

export { stripe, initializeStripe };
