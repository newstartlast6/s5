import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface CheckoutSession {
  id: string;
  object: string;
  product: string;
  checkout_url: string;
  status: string;
  metadata: {
    email: string;
    user_id: string;
  };
  mode: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json().catch(() => ({}));
    const { pId, userId, email } = body as {
      pId?: string;
      userId?: string;
      email?: string;
    };

    // Basic validation
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { success: false, message: "email is required" },
        { status: 400 },
      );
    }
    if (!pId && process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { success: false, message: "product id (pId) is required" },
        { status: 400 },
      );
    }

    // Verify user session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Choose product id, apiKey and url
    const productId =
      // process.env.NODE_ENV === "development" ? "prod_2oNGxUhor4fV6yAVNga2kf" : pId!;
      process.env.NODE_ENV === "development"
        ? "prod_1FVYSkTv3ur6jDliBI2Mt"
        : pId!;

    const apiKey =
      process.env.NODE_ENV === "development"
        ? "creem_test_xLoOsMLvJXVpo84dzVOj1"
        : process.env.CREEM_API_KEY;
    const creemUrl =
      process.env.NODE_ENV === "development"
        ? "https://test-api.creem.io/v1/checkouts"
        : "https://api.creem.io/v1/checkouts";

    // Build payload
    const payload = {
      product_id: productId,
      request_id: userId,
      customer: { email },
      metadata: { user_id: userId, email },
    };

    // Send request with fetch (simpler than axios here)
    const res = await fetch(creemUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey ?? "",
      },
      body: JSON.stringify(payload),
    });

    // Attempt to parse JSON body (if any)
    let data: unknown = null;
    try {
      data = await res.json();
    } catch (e) {
      // No JSON body — keep data null
    }

    // If remote returned non-2xx, return its JSON (if available) or status text
    if (!res.ok) {
      // The Creem API often returns an error object — forward it back to client
      return NextResponse.json(
        {
          success: false,
          status: res.status,
          error: data ?? res.statusText,
        },
        { status: res.status },
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        checkout: data as CheckoutSession,
      },
      { status: 200 },
    );
  } catch (err) {
    // Network/other errors
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
