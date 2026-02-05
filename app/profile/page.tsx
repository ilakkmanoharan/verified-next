"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileDoc, getUserDoc } from "@/lib/firebase/firestore";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { Profile } from "@/types/profile";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/profile");
      return;
    }
    if (!user) return;

    let cancelled = false;
    (async () => {
      try {
        const [profileSnap, userSnap] = await Promise.all([
          getProfileDoc(user.uid),
          getUserDoc(user.uid),
        ]);
        if (!cancelled) {
          setProfile(profileSnap ?? null);
          setUserPhotoURL(userSnap?.photoURL ?? user.photoURL ?? null);
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProfileForm
      user={user}
      initialProfile={profile}
      userPhotoURL={userPhotoURL}
    />
  );
}
