import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY environment variable is not set');
      }
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-03-31.basil',
        typescript: true,
      });
    }
    const value = (_stripe as any)[prop];
    return typeof value === 'function' ? value.bind(_stripe) : value;
  },
});
