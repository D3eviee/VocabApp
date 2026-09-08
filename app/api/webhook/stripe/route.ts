import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/server/db";
import { users } from "@/server/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;
  let event: Stripe.Event;

  // STRIPE VALIDATION
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    console.error(`[STRIPE WEBHOOK ERROR]: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try{
    switch(event.type){

      // SCENARIO 1 - NEW SUBSCRIBTION
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const priceId = session.metadata?.priceId
        const userId = session.metadata?.userId

        if (userId && priceId){
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

          await db
            .update(users)
            .set({
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
              stripeCancelAtPeriodEnd: false,
            })
            .where(eq(users.id, userId));
        }
        break
      }

      // SCENARIO 2 - RENEW SUBSCRIBTION OR CANCEL PLAN
      case "customer.subscription.updated" : {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await db.query.users.findFirst({where: eq(users.stripeCustomerId, customerId)});

        if(user){
          await db
            .update(users)
            .set({
              stripeCancelAtPeriodEnd: subscription.cancel_at_period_end || false,
              stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
            })
            .where(eq(users.id, user.id))
        }
        break
      }

      // SCENARIO 3 - SUBSCRIBTION DELETED
      case "customer.subscription.deleted" : {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await db.query.users.findFirst({where: eq(users.stripeCustomerId, customerId)});

        if(user){
          await db
            .update(users)
            .set({
              stripePriceId: null,
              stripeSubscriptionId: null,
              stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
              stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
            })
            .where(eq(users.id, user.id))
        }
        break
      }
      default:
        console.log(`Unhandeled event type: ${event.type}`)
    }
    return new NextResponse("Webhook processed successfully", { status: 200 });
  }catch (error) {
    console.error(`[STRIPE WEBHOOK PROCESSING ERROR]:`, error);
    return new NextResponse(`Webhook Error: ${error}`, { status: 500 });
  }
}