'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/banner.jpeg"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Dark Transparent Overlay */}
      <div className="absolute inset-0  bg-opacity-20 z-10" />

      {/* Glassmorphic Content Area */}
      <div className="relative z-20 px-6 text-center max-w-3xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-10 shadow-2xl">
        <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
          Welcome to <span className="text-purple-400">AI Interview Mockup</span>
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          An innovative solution to simplify your workflow and elevate your productivity.
          Get started today and explore the features we've built just for you.
        </p>
        <Button
          className="text-lg px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 transition-all shadow-md"
          onClick={() => router.push('/dashboard')}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
