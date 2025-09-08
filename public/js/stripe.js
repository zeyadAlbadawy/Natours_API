import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(
  'pk_test_51S3FriKfeuIawVzRVemtbtfZ28sZNPfDQxeD76t8LOWtFeIbkHnB0GdNyF3CoIbpUYrUXhnYtSAfmtSQoFM0BCyL005yI2WRSe',
);

export const bookTour = async (tourId) => {
  // 1) Get Checkout session from backend
  const session = await axios.get(
    `/api/v1/bookings/checkout-session/${tourId}`,
  );

  // 2) Use Stripe.js in browser
  const stripe = await stripePromise;

  // 3) Redirect
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id,
  });
};
