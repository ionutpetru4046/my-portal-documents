import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    // Only paid plans go to Stripe
    const prices: Record<string, string> = {
      pro: "price_1SGfIR2MikuzgTkulZkKVj52",     // Replace with your real Pro price ID
      premium: "price_1SGfIR2MikuzgTkulZkKVj53", // Replace with your real Premium price ID
    };

    if (!prices[plan]) {
      return NextResponse.json({ error: "Free plan selected, no checkout needed" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
