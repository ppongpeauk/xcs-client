const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function CreateCustomerPortalSession(req: any, res: any) {
  const { user } = req.body;

  const session = await stripe.billingPortal.sessions.create({
    customer: user.customerId,
    return_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/platform`,
  });

  res.json({ url: session.url });
}

export default CreateCustomerPortalSession;