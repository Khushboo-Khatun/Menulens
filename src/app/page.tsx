"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function RootPage() {
  const router = useRouter();
  const { profile } = useUserStore();

  useEffect(() => {
    // Check if user is already onboarded via store / localStorage
    if (profile.isOnboarded) {
      router.replace("/home");
    } else {
      router.replace("/welcome");
    }
  }, [profile.isOnboarded, router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}
