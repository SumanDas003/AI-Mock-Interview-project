'use client';

import React from "react";
import { useRouter } from "next/navigation";

const plans = {
  premium: { amount: 20, description: "Premium Plan - $20/month" },
  basic: { amount: 5, description: "Basic Plan - $5/month" },
};

function Upgrade() {
  // Function to load Razorpay script
  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePayment(planKey) {
    const plan = plans[planKey];

    // Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Create order on backend
    const response = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: plan.amount }),
    });

    const orderData = await response.json();
    if (!response.ok) {
      alert(orderData.error || "Server error creating order");
      return;
    }

    // Configure Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Pass this key via NEXT_PUBLIC_ env variable
      amount: orderData.amount,
      currency: orderData.currency,
      name: "AI Interview Mockup",
      description: plan.description,
      order_id: orderData.id,
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // You can do further processing here (verify payment on backend, update DB, etc.)
      },
      prefill: {
        name: "", // Optional: Add user info here
        email: "",
        contact: "",
      },
      theme: { color: "#4c51bf" },
    };

    // Open Razorpay checkout
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-start md:gap-10">
        {/* Premium Plan */}
        <div className="rounded-2xl border border-indigo-600 p-6 shadow-md ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Premium</h2>
            <p className="mt-2">
              <span className="text-4xl font-bold text-gray-900">$20</span>
              <span className="text-sm font-medium text-gray-700">/month</span>
            </p>
          </div>
          <ul className="mt-6 space-y-3">
            <FeatureItem text="Unlimited mock interviews" />
            <FeatureItem text="AI-powered personalized feedback" />
            <FeatureItem text="30GB video recording storage" />
            <FeatureItem text="Priority support (email + live chat)" />
            <FeatureItem text="Access to expert feedback tools" />
          </ul>
          <button
            onClick={() => handlePayment("premium")}
            className="mt-8 w-full rounded-full bg-indigo-600 px-12 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Upgrade to Premium
          </button>
        </div>

        {/* Basic Plan */}
        <div className="rounded-2xl border border-gray-300 p-6 shadow-sm sm:px-8 lg:p-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Basic</h2>
            <p className="mt-2">
              <span className="text-4xl font-bold text-gray-900">$5</span>
              <span className="text-sm font-medium text-gray-700">/month</span>
            </p>
          </div>
          <ul className="mt-6 space-y-3">
            <FeatureItem text="1 mock interview per day" />
            <FeatureItem text="Basic AI feedback" />
            <FeatureItem text="5GB video storage" />
            <FeatureItem text="Standard email support" />
          </ul>
          <button
            onClick={() => handlePayment("basic")}
            className="mt-8 w-full rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
          >
            Continue with Basic
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable FeatureItem component
function FeatureItem({ text }) {
  return (
    <li className="flex items-center gap-2 text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-indigo-600"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}

export default Upgrade;
