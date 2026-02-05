"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import type { Profile } from "@/types/profile";
import { ProfileSidebar } from "./ProfileSidebar";
import { DashboardTabs, type DashboardTab } from "./DashboardTabs";
import { OverviewContent } from "./OverviewContent";
import { TestsTabContent } from "./TestsTabContent";
import { ProjectsTabContent } from "./ProjectsTabContent";

interface DashboardLayoutProps {
  user: User;
  profile: Profile | null;
  photoURL: string | null;
}

export function DashboardLayout({ user, profile, photoURL }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <ProfileSidebar user={user} profile={profile} photoURL={photoURL} />
        <div className="min-w-0 flex-1">
          <DashboardTabs active={activeTab} onSelect={setActiveTab} />
          <div className="mt-4">
            {activeTab === "overview" && <OverviewContent profile={profile} />}
            {activeTab === "tests" && <TestsTabContent />}
            {activeTab === "projects" && <ProjectsTabContent profile={profile} />}
          </div>
        </div>
      </div>
    </div>
  );
}
