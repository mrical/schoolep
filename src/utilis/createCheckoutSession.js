import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {initializeStripe} from "./initializeStripe";

export async function createCheckoutSession(uid, priceId) {
  // Init Stripe
  // Create a new checkout session in the subollection inside this users document
  //   const { unit_amount } = await stripe.prices.retrieve(priceId);

  const checkoutSessionRef = await addDoc(
    collection(db, `users/${uid}/checkout_sessions`),
    {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    }
  );

  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(checkoutSessionRef, async (snap) => {
    const { sessionId } = snap.data();
    if (sessionId) {
      // We have a session, let's redirect to Checkout
      const stripe = await initializeStripe();
      stripe.redirectToCheckout({ sessionId });
    }
  });
}
