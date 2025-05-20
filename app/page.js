'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <Image
        src="/banner.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover w-full h-full z-0"
        style={{ objectPosition: 'center top' }} 
      />

      <div className="absolute inset-0 bg-opacity-50 z-10" />

      <div className="relative z-20 px-4 sm:px-6 text-center max-w-3xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-10 shadow-2xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
          Welcome to <span className="text-purple-400">AI Interview Mockup</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-10">
          Practice, prepare, and improve with AI-powered mock interviews. Built to help you boost your confidence and performance.
        </p>
        <Button
          className="text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all shadow-md"
          onClick={() => router.push('/dashboard')}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
