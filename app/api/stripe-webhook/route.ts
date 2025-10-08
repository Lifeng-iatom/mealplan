import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
        return new Response("No signature", { status: 400 });
    }

    if (!webhookSecret) {
        return new Response("No webhook secret", { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
            break;
          }
          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentFailed(invoice);
            break;
          }
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription);
            break;
          }
          // Add more event types as needed
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } catch (e: any) {
        console.error(`stripe error: ${e.message} | EVENT TYPE: ${event.type}`);
        return NextResponse.json({ error: e.message }, { status: 400 });
      }

    return NextResponse.json({});
   
    
}


const handleCheckoutSessionCompleted = async (
    session: Stripe.Checkout.Session
  ) => {
    const userId = session.metadata?.clerkUserId;
    const subscriptionId = session.subscription;
    if (!userId || !subscriptionId) {
        return new Response("No user ID or subscriptionId", { status: 400 });
    }

    try {
        await prisma.profile.update({
            where: { userId },
            data: {
                subscriptionActive: true,
                subscriptionTier: session.metadata?.planType || null,
                stripeSubscriptionId: subscriptionId as string,
            },
        });
    } catch (e: any) {
        console.error(`stripe error: ${e.message}`);
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription! as string;

  
    if (!subscriptionId) {
      
      return;
    }
  
    // Retrieve userId from subscription ID
    let userId: string | undefined;
    try {
      const profile = await prisma.profile.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
        select: { userId: true },
      });
  
      if (!profile?.userId) {
        console.error("No profile found for this subscription ID.");
        return;
      }
  
      userId = profile.userId;
    } catch (error: any) {
      console.error("Prisma Query Error:", error.message);
      return;
    }
  
    // Update Prisma with payment failure
    try {
      await prisma.profile.update({
        where: { userId },
        data: {
          subscriptionActive: false,
        },
      });
      console.log(`Subscription payment failed for user: ${userId}`);
    } catch (error: any) {
      console.error("Prisma Update Error:", error.message);
    }

}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const subscriptionId = subscription.id;
    // Retrieve userId from subscription ID
    let userId: string | undefined;
    try {
        const profile = await prisma.profile.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
        select: { userId: true },
        });

        if (!profile?.userId) {
        console.error("No profile found for this subscription ID.");
        return;
        }

        userId = profile.userId;
    } catch (error: any) {
        console.error("Prisma Query Error:", error.message);
        return;
    }

    // Update Prisma with subscription cancellation
    try {
        await prisma.profile.update({
        where: { userId },
        data: {
            subscriptionActive: false,
            stripeSubscriptionId: null,
            subscriptionTier: null,
        },
        });
        
    } catch (error: any) {
        console.error("Prisma Update Error:", error.message);
    }

}