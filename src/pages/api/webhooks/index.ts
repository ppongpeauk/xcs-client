import Stripe from "stripe";

import { setUserSubscription, updateUserSubscription } from "@/lib/database";
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string, {
    apiVersion: '2022-11-15',
  });

  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string;

  if (req.method === 'POST') {
    // verify the request is from stripe
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      const body = await buffer(req);
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err : any) {
      console.log(`Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // cast event data to stripe object
    if (event.type === 'payment_intent.succeeded') {
      const stripeObject: Stripe.PaymentIntent = event.data
        .object as Stripe.PaymentIntent;
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      await setUserSubscription(charge.billing_details.email as string, charge.customer as string, true);
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      // console.log(`🔁 Subscription status: ${subscription.status}`);
      if (subscription.status === 'active') {
        await updateUserSubscription(subscription.customer as string, true);
      } else if (subscription.status === 'canceled') {
        await updateUserSubscription(subscription.customer as string, false);
      }
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // return a response to acknowledge receipt of the event
    res.json({received: true});
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};

export default handler;