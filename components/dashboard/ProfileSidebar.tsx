"use client";

import Image from "next/image";
import Link from "next/link";
import type { User } from "firebase/auth";
import type { Profile } from "@/types/profile";

function getHandle(user: User): string {
  if (user.displayName && /^[a-zA-Z0-9_-]+$/.test(user.displayName)) {
    return user.displayName;
  }
  if (user.email) {
    return user.email.split("@")[0];
  }
  return "user";
}

function getDisplayName(user: User, profile: Profile | null): string {
  if (user.displayName?.trim()) return user.displayName.trim();
  if (profile?.headline?.trim()) return profile.headline.trim();
  if (user.email) return user.email.split("@")[0];
  return "Anonymous";
}

interface ProfileSidebarProps {
  user: User;
  profile: Profile | null;
  photoURL: string | null;
}

export function ProfileSidebar({ user, profile, photoURL }: ProfileSidebarProps) {
  const displayName = getDisplayName(user, profile);
  const handle = getHandle(user);
  const links = profile?.links ?? {};
  const hasLinks = links.github || links.linkedin || links.portfolio;
  const certCount = profile?.certifications?.length ?? 0;

  return (
    <aside className="w-full shrink-0 md:w-64 lg:w-72">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:sticky md:top-6">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800">
            {photoURL ? (
              <Image
                src={photoURL}
                alt="Profile"
                fill
                className="object-cover"
                sizes="160px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-zinc-500">
                {displayName[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">{displayName}</h1>
          <p className="text-sm text-zinc-500">@{handle}</p>
          <Link
            href="/profile"
            className="mt-3 w-full rounded-lg border border-zinc-600 bg-transparent px-4 py-2 text-center text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Edit profile
          </Link>
          <p className="mt-3 text-xs text-zinc-500">
            {certCount > 0
              ? `${certCount} certification${certCount !== 1 ? "s" : ""} · `
              : ""}
            Tests coming soon
          </p>
          {hasLinks && (
            <div className="mt-4 flex w-full flex-col gap-2 border-t border-zinc-800 pt-4">
              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                  <span className="text-zinc-500">GitHub</span>
                  <span className="truncate">{links.github.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                  <span className="text-zinc-500">LinkedIn</span>
                  <span className="truncate">{links.linkedin.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
              {links.portfolio && (
                <a
                  href={links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                  <span className="text-zinc-500">Portfolio</span>
                  <span className="truncate">{links.portfolio.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
