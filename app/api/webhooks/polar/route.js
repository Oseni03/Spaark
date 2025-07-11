import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/utils";

// List of all relevant Polar webhook event types
const SUBSCRIPTION_EVENTS = [
  "SUBSCRIPTION_ACTIVATED",
  "SUBSCRIPTION_PENDING",
  "SUBSCRIPTION_PAUSED",
  "SUBSCRIPTION_RESUMED",
  "SUBSCRIPTION_COMPLETED",
  "SUBSCRIPTION_CHARGED",
  "SUBSCRIPTION_HALTED",
  "SUBSCRIPTION_CANCELLED",
  "SUBSCRIPTION_REVOKE_FAILED",
  "SUBSCRIPTION_UPDATED",
  "SUBSCRIPTION_UPDATE_FAILED",
];
const PAYMENT_EVENTS = [
  "ORDER_AUTHORIZED",
  "ORDER_PROCESSED",
  "ORDER_CANCELLED",
  "PAYMENT_FAILED",
  "ORDER_FAILED",
];
const REFUND_EVENTS = [
  "REFUND_PROCESSED",
  "REFUND_FAILED",
];

export async function POST(req) {
  try {
    const payload = await req.json();
    const event = payload.event_type || payload.event;
    const data = payload.data;
    logger.info(`Received Polar webhook: ${event}`);

    // Handle subscription events
    if (SUBSCRIPTION_EVENTS.includes(event)) {
      // Update subscription status in DB
      await prisma.subscription.updateMany({
        where: { polarSubscriptionId: data.id },
        data: {
          status: data.status || event,
          planType: data.planType || data.plan || "",
        },
      });
      logger.info(`Subscription event handled: ${event}`);
    }
    // Handle payment/order events
    else if (PAYMENT_EVENTS.includes(event)) {
      // You may want to update a Transaction model or log payment status
      logger.info(`Payment event: ${event} for order ${data.order_id}`);
      // Optionally update subscription if order is linked
      if (data.subscription_id) {
        await prisma.subscription.updateMany({
          where: { polarSubscriptionId: data.subscription_id },
          data: {
            status: event,
          },
        });
      }
    }
    // Handle refund events
    else if (REFUND_EVENTS.includes(event)) {
      logger.info(`Refund event: ${event} for order ${data.order_id}`);
      // Optionally update a Transaction or Refund model
    }
    // Handle ping or unknown events
    else if (event === "PING") {
      logger.info("Received Polar webhook ping");
    } else {
      logger.warn(`Unhandled Polar webhook event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Polar webhook processing error:", error);
    return NextResponse.json(
      { error: "Polar webhook processing failed" },
      { status: 500 }
    );
  }
}