import Razorpay from "razorpay";
import { NextResponse } from "next/server";


export async function POST(req) {
  const body = await req.json();

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: body.amount * 100, // Amount in paise
    currency: "INR",
    receipt: "receipt_order_74394",
  };

  try {
    const order = await instance.orders.create(options);
    return Response.json({ order });
  } catch (err) {
    console.error("Razorpay error:", err);
    return new Response(JSON.stringify({ error: "Failed to create Razorpay order" }), {
      status: 500,
    });
  }
}
