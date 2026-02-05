"use client";

import Link from "next/link";
import type { Profile } from "@/types/profile";

interface ProjectsTabContentProps {
  profile: Profile | null;
}

export function ProjectsTabContent({ profile }: ProjectsTabContentProps) {
  const projects = profile?.projects ?? [];

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">No projects yet</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add projects in your profile to showcase what you&apos;ve built.
        </p>
        <Link
          href="/profile"
          className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((p, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <h3 className="font-medium text-white">
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {p.name}
              </a>
            ) : (
              p.name
            )}
          </h3>
          {p.description && (
            <p className="mt-1 text-sm text-zinc-400">{p.description}</p>
          )}
          {p.techStack && p.techStack.length > 0 && (
            <p className="mt-2 text-xs text-zinc-500">
              {p.techStack.join(" · ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
