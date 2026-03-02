import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local." },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "SciMax — Full Protocol Access",
              description:
                "Your complete personalized science-backed optimization protocol. Updated as science evolves.",
              images: [],
            },
            unit_amount: 1299, // $12.99 in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${appUrl}/results?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/results?payment=cancelled`,
      metadata: {
        source: "scimax_protocol",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment error: ${err.message}` },
        { status: err.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
