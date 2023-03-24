const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function CreateStripeSession(req: any, res: any) {
  const { item, user } = req.body;

  const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://xcs.restrafes.co';

  const transformedItem = {
    quantity: 1,
    price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [transformedItem],
    mode: 'subscription',
    success_url: redirectURL + "/platform/upgrade/thank-you",
    cancel_url: redirectURL + "/platform/upgrade",
    customer_email: user.email,
    metadata: {uid: user.id},
    allow_promotion_codes: true,
    customer: user.customerId || undefined,
  });

  res.json({ id: session.id });
}

export default CreateStripeSession;