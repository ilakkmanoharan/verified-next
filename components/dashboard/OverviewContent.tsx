"use client";

import Link from "next/link";
import type { Profile } from "@/types/profile";

function isEmptyProfile(profile: Profile | null): boolean {
  if (!profile) return true;
  const hasHeadline = !!profile.headline?.trim();
  const hasBio = !!profile.bio?.trim();
  const hasExp = (profile.experience?.length ?? 0) > 0;
  const hasSkills = (profile.skills?.length ?? 0) > 0;
  const hasLinks =
    profile.links?.github || profile.links?.linkedin || profile.links?.portfolio;
  const hasCerts = (profile.certifications?.length ?? 0) > 0;
  const hasProjects = (profile.projects?.length ?? 0) > 0;
  return !hasHeadline && !hasBio && !hasExp && !hasSkills && !hasLinks && !hasCerts && !hasProjects;
}

interface OverviewContentProps {
  profile: Profile | null;
}

export function OverviewContent({ profile }: OverviewContentProps) {
  if (isEmptyProfile(profile)) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Complete your profile</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add a headline, bio, experience, and links so employers can find you.
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

  const links = profile?.links ?? {};
  const experience = profile?.experience ?? [];
  const skills = profile?.skills ?? [];
  const certifications = profile?.certifications ?? [];
  const projects = profile?.projects ?? [];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      {profile?.headline && (
        <p className="text-lg font-semibold text-white">{profile.headline}</p>
      )}
      {profile?.bio && (
        <div className="mt-3 whitespace-pre-wrap text-zinc-300">{profile.bio}</div>
      )}

      {experience.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            About
          </h3>
          <ul className="mt-2 space-y-2">
            {experience.slice(0, 4).map((exp, i) => (
              <li key={i} className="text-sm text-zinc-300">
                <span className="font-medium text-white">{exp.role}</span>
                {exp.company && (
                  <>
                    {" "}
                    <span className="text-zinc-500">at</span>{" "}
                    <span className="text-zinc-400">{exp.company}</span>
                  </>
                )}
                <span className="text-zinc-500">
                  {" "}
                  · {exp.startDate}
                  {exp.current ? " – Present" : exp.endDate ? ` – ${exp.endDate}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Tech stack
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span
                key={i}
                className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {(links.github || links.linkedin || links.portfolio) && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            How to reach me
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {links.github && (
              <li>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  GitHub
                </a>
              </li>
            )}
            {links.linkedin && (
              <li>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            )}
            {links.portfolio && (
              <li>
                <a
                  href={links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Portfolio
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Certifications
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {certifications.slice(0, 5).map((c, i) => (
              <li key={i}>
                {c.name}
                {c.issuer && <span className="text-zinc-500"> · {c.issuer}</span>}
              </li>
            ))}
            {certifications.length > 5 && (
              <li className="text-zinc-500">
                +{certifications.length - 5} more —{" "}
                <Link href="/profile" className="text-blue-400 hover:underline">
                  see full profile
                </Link>
              </li>
            )}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Projects
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {projects.slice(0, 5).map((p, i) => (
              <li key={i}>
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-400 hover:underline"
                  >
                    {p.name}
                  </a>
                ) : (
                  <span className="font-medium text-white">{p.name}</span>
                )}
                {p.description && (
                  <span className="text-zinc-500"> — {p.description}</span>
                )}
              </li>
            ))}
            {projects.length > 5 && (
              <li>
                <Link href="/profile" className="text-blue-400 hover:underline">
                  See all projects
                </Link>
              </li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
