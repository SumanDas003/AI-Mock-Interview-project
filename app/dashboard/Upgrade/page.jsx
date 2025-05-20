import React from 'react';

function Upgrade() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-start md:gap-10">
        {/* Premium Plan */}
        <div className="rounded-2xl border border-indigo-600 p-6 shadow-md ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Premium</h2>
            <p className="mt-2">
              <span className="text-4xl font-bold text-gray-900">$30</span>
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
          <a
            href="#"
            className="mt-8 block rounded-full bg-indigo-600 px-12 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Upgrade to Premium
          </a>
        </div>

        {/* Basic Plan */}
        <div className="rounded-2xl border border-gray-300 p-6 shadow-sm sm:px-8 lg:p-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Basic</h2>
            <p className="mt-2">
              <span className="text-4xl font-bold text-gray-900">$15</span>
              <span className="text-sm font-medium text-gray-700">/month</span>
            </p>
          </div>
          <ul className="mt-6 space-y-3">
            <FeatureItem text="1 mock interview per day" />
            <FeatureItem text="Basic AI feedback" />
            <FeatureItem text="5GB video storage" />
            <FeatureItem text="Standard email support" />
          </ul>
          <a
            href="#"
            className="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
          >
            Continue with Basic
          </a>
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
