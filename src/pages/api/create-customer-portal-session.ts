import { updateUserCustomerID } from "@/lib/database";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function CreateCustomerPortalSession(req: any, res: any) {
  const { user } = req.body;

  var customer;

  if (!user.customerId) {
    customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName,
    });
    await updateUserCustomerID(customer.id, user.id);
  } else {
    var customer = await stripe.customers.retrieve(user.customerId);
  }

  if (customer.deleted) {
    customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName,
    });
    await updateUserCustomerID(customer.id, user.id);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/platform`,
  });

  res.json({ url: session.url });
}

export default CreateCustomerPortalSession;