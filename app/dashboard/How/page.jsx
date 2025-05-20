import React from 'react';
import {
  UserPlus,
  PlayCircle,
  BarChart,
  Lamp,
  MessageSquare
} from 'lucide-react'; // Ensure lucide-react is installed

const steps = [
  {
    icon: <UserPlus className="h-8 w-8 text-indigo-600" />,
    title: 'Create Your Account',
    description: 'Sign up or log in to get started. Your journey begins with a personalized dashboard.',
  },
  {
    icon: <Lamp className="h-8 w-8 text-indigo-600" />,
    title: 'Choose an Interview Type',
    description: 'Select your domain or role. We’ll tailor questions and tone to match your goals.',
  },
  {
    icon: <PlayCircle className="h-8 w-8 text-indigo-600" />,
    title: 'Start the Interview',
    description: 'Use your webcam and mic to begin the mock interview in a realistic environment.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
    title: 'Get Instant Feedback',
    description: 'Our AI gives you smart feedback on your communication, clarity, and confidence.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-indigo-600" />,
    title: 'Track Your Progress',
    description: 'Review your transcripts, scores, and improvement tips in your dashboard.',
  },
];

function How() {
  return (
    <section className="bg-gray-50 py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-lg text-gray-600 mb-12">
          A smarter way to prepare for interviews – fast, personalized, and insightful.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default How;
