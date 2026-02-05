"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileDoc, getUserDoc } from "@/lib/firebase/firestore";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { CTAButtons } from "@/components/landing/CTAButtons";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { Profile } from "@/types/profile";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setProfileLoading(true);
      try {
        const [profileSnap, userSnap] = await Promise.all([
          getProfileDoc(user.uid),
          getUserDoc(user.uid),
        ]);
        if (!cancelled) {
          setProfile(profileSnap ?? null);
          setPhotoURL(userSnap?.photoURL ?? user.photoURL ?? null);
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    if (profileLoading) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      );
    }
    return (
      <DashboardLayout
        user={user}
        profile={profile}
        photoURL={photoURL}
      />
    );
  }

  return (
    <>
      <Hero />
      <FeatureCards />
      <CTAButtons />
    </>
  );
}
