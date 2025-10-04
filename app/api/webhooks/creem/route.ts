import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as crypto from "crypto";

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

if (process.env.NODE_ENV !== "development") {
  console.log("Webhook handler is only available in development mode");
} else {
  console.log("Webhook handler is only available in production mode");
}

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET!;

var PLAN_VIDEO_LIMITS: { [key: string]: number } = {};
var LIFETIME_PLAN_IDS: string[] = [];

if (process.env.NODE_ENV !== "development") {
  PLAN_VIDEO_LIMITS = {
    [process.env.NEXT_PUBLIC_CREEM_STARTER_PLAN_ID!]: 10, // Starter: 10 videos
    [process.env.NEXT_PUBLIC_CREEM_PROFESSIONAL_PLAN_ID!]: 70, // Growth: 70 videos
    [process.env.NEXT_PUBLIC_CREEM_ENTERPRISE_PLAN_ID!]: 200, // Scale: 200 videos
  };
  LIFETIME_PLAN_IDS = [process.env.NEXT_PUBLIC_CREEM_LIFETIME_PLAN_ID!];
} else {
  PLAN_VIDEO_LIMITS = {
    [process.env.NEXT_PUBLIC_CREEM_MONTHLY_PLAN_ID!]: 1000, // Monthly plan: 1000 videos
  };
  LIFETIME_PLAN_IDS = [process.env.NEXT_PUBLIC_CREEM_LIFETIME_PLAN_ID!]; // Test lifetime plan ID (different product)
}

function verifyCreemSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature),
  );
}

export async function POST(request: Request) {
  console.log("Received webhook request");
  const body = await request.text();
  console.log("Webhook body:", body);
  const signature = request.headers.get("creem-signature");
  console.log("Webhook signature:", signature);

  try {
    console.log("Verifying signature");
    // Verify webhook signature
    if (
      !signature ||
      !verifyCreemSignature(body, signature, CREEM_WEBHOOK_SECRET)
    ) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    console.log("Signature verified successfully");

    const event = JSON.parse(body);
    console.log("Webhook event:", event);

    // Get the user_id from metadata
    const userId = event.object?.metadata?.user_id;
    console.log("Extracted userId:", userId);
    if (!userId) {
      console.error("No user_id found in webhook metadata");
      return NextResponse.json({ error: "No user_id found" }, { status: 400 });
    }

    // Get the product ID - different structure for checkout vs subscription events
    let productId, subscriptionId, customerId;

    if (event.eventType === "checkout.completed") {
      // For one-time purchases (like lifetime deals)
      productId = event.object?.product?.id;
      subscriptionId = event.object?.id; // Use checkout ID as subscription ID for lifetime
      customerId = event.object?.customer?.id;
    } else {
      // For subscription events
      productId = event.object?.product?.id;
      subscriptionId = event.object?.id;
      customerId = event.object?.customer?.id;
    }

    console.log("Extracted productId:", productId);
    console.log("Extracted subscriptionId:", subscriptionId);
    console.log("Extracted customerId:", customerId);

    if (!productId) {
      console.error("No product ID found in webhook");
      return NextResponse.json(
        { error: "No product ID found" },
        { status: 400 },
      );
    }

    const isLifetime = LIFETIME_PLAN_IDS.includes(productId);
    const videoLimit = isLifetime ? 999999 : PLAN_VIDEO_LIMITS[productId] || 0; // Unlimited for lifetime
    console.log("Determined videoLimit:", videoLimit);
    console.log("Is lifetime plan:", isLifetime);
    if (process.env.NODE_ENV !== "development") {
      console.log("In production mode, video limit is:", videoLimit);
    } else {
      console.log("In development mode, video limit is:", videoLimit);
    }

    console.log("Event type:", event.eventType);
    switch (event.eventType) {
      case "checkout.completed":
      case "subscription.paid": {
        console.log(`Handling ${event.eventType} event`);
        // Get existing subscription
        console.log("Fetching existing subscription for userId:", userId);
        const { data: existingSub, error: fetchError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (fetchError) {
          console.error("Error fetching existing subscription:", fetchError);
          throw fetchError;
        }
        console.log("Existing subscription:", existingSub);

        if (!existingSub) {
          // Case 1: New subscription - create with initial limit
          console.log("No existing subscription found, creating new one");
          const newSubData = {
            user_id: userId,
            status: "active",
            product_id: productId,
            subscription_id: subscriptionId,
            customer_id: customerId,
            videos_limit: videoLimit,
            videos_used: 0,
            is_lifetime: isLifetime,
            lifetime_purchased_at: isLifetime ? new Date().toISOString() : null,
            webhook_data: event,
            metadata: event.object.metadata || {},
            created_at: new Date().toISOString(),
          };
          console.log("New subscription data to upsert:", newSubData);
          const { data: upsertData, error: upsertError } = await supabase
            .from("subscriptions")
            .upsert(newSubData);
          if (upsertError) {
            console.error("Error upserting new subscription:", upsertError);
            throw upsertError;
          }
          console.log("New subscription upserted successfully:", upsertData);
        } else if (existingSub.subscription_id !== subscriptionId) {
          // Case 2: Different subscription ID - add remaining videos to new limit
          console.log(
            "Existing subscription found with different subscription_id, updating",
          );
          const remainingVideos = Math.max(
            0,
            existingSub.videos_limit - existingSub.videos_used,
          );
          const newTotalLimit = videoLimit + remainingVideos;
          console.log("Calculated remainingVideos:", remainingVideos);
          console.log("Calculated newTotalLimit:", newTotalLimit);
          const updateSubData = {
            user_id: userId,
            status: "active",
            product_id: productId,
            subscription_id: subscriptionId,
            customer_id: customerId,
            videos_limit: isLifetime ? 999999 : newTotalLimit,
            videos_used: existingSub.videos_used,
            is_lifetime: isLifetime,
            lifetime_purchased_at: isLifetime
              ? new Date().toISOString()
              : existingSub.lifetime_purchased_at,
            webhook_data: event,
            metadata: event.object.metadata || {},
            updated_at: new Date().toISOString(),
          };
          console.log("Update subscription data to upsert:", updateSubData);
          const { data: upsertData, error: upsertError } = await supabase
            .from("subscriptions")
            .upsert(updateSubData, { onConflict: "user_id" });
          if (upsertError) {
            console.error("Error upserting updated subscription:", upsertError);
            throw upsertError;
          }
          console.log(
            "Updated subscription upserted successfully:",
            upsertData,
          );
        } else {
          console.log(
            "Existing subscription with same subscription_id, no action needed",
          );
        }
        // Case 3: Same subscription ID - do nothing
        break;
      }

      case "subscription.cancelled": {
        console.log("Handling subscription.cancelled event");
        const updateData = {
          status: "cancelled",
          webhook_data: event,
          updated_at: new Date().toISOString(),
        };
        console.log("Subscription update data:", updateData);
        const { data: updateResult, error: updateError } = await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("user_id", userId);
        if (updateError) {
          console.error(
            "Error updating subscription to cancelled:",
            updateError,
          );
          throw updateError;
        }
        console.log(
          "Subscription updated to cancelled successfully:",
          updateResult,
        );
        break;
      }

      default: {
        console.log("Unhandled event type:", event.eventType);
        break;
      }
    }

    console.log("Webhook processing completed successfully");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
