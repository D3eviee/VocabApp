// app/actions/stripe.ts
"use server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { users } from "@/server/schema";
import { eq } from "drizzle-orm";

const returnUrl = process.env.NEXT_PUBLIC_APP_URL + "/dashboard/profile";
const stripePriceId = process.env.STRIPE_PRO_PRICE_ID!

// SUB OPTION FOR FREE TIER
// AUTHENTICATING AND CREATING STRIPE CHECKOUT SESSION FOR THE USER
// RETURNS STRIPE SESSION URL OR ERROR
export async function createStripeSession() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Logiin to get access. User unothorized" };

    let customerId = user.stripeCustomerId

    if(!customerId){
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      })
      customerId = customer.id

      await db
        .update(users)
        .set({stripeCustomerId: customer.id})
        .where(eq(users.id, user.id))
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: { 
        userId: user.id,
        priceId: stripePriceId,
      },
      success_url: returnUrl,
      cancel_url: returnUrl,
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return { error: "Server error while creating checkout session. Try later." };
  }
}

// CREATING STRIPE PORTAL SESSION TO MANAGE SUBSCRIBTION PLAN
export async function createCustomerPortalSession() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Login to get access. User unauthorized." };

    // StripeCustomerID from DB
    const customer = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { stripeCustomerId: true }
    });

    if (!customer?.stripeCustomerId) return { error: "No billing account found." };

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: portalSession.url };
  } catch (error) {
    console.error("Stripe portal error:", error);
    return { error: "Server error occured. Try again later." };
  }
}