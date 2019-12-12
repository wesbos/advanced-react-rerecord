import stripe from 'stripe';

const stripeConfig = stripe(process.env.STRIPE_SECRET);
export default stripeConfig;
