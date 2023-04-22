import { updateUserCustomerID } from "@/lib/database";
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

  var customer;

  if (!user.payment.customerId) {
    customer = await stripe.customers.create({
      email: user.email.value,
      name: `${user.firstName} ${user.lastName}`,
    });
    await updateUserCustomerID(customer.id, user.id);
  } else {
    var customer = await stripe.customers.retrieve(user.payment.customerId);
  }

  if (customer.deleted) {
    customer = await stripe.customers.create({
      email: user.email.value,
      name: `${user.firstName} ${user.lastName}`,
    });
    await updateUserCustomerID(customer.id, user.id);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [transformedItem],
    mode: 'subscription',
    success_url: redirectURL + "/platform/upgrade/thank-you",
    cancel_url: redirectURL + "/platform/upgrade",
    metadata: {uid: user.id},
    allow_promotion_codes: true,
    customer: customer.id
  });

  res.json({ id: session.id });
}

export default CreateStripeSession;