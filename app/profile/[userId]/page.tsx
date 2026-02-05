"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getProfileDoc, getUserDoc } from "@/lib/firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/types/profile";

export default function PublicProfilePage() {
  const params = useParams();
  const userId = typeof params.userId === "string" ? params.userId : "";
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null | "private">(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.uid === userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [profileDoc, userDoc] = await Promise.all([
          getProfileDoc(userId),
          getUserDoc(userId),
        ]);
        if (cancelled) return;
        if (!profileDoc) {
          setProfile(isOwnProfile ? null : "private");
          setDisplayName(userDoc?.displayName ?? null);
          setPhotoURL(userDoc?.photoURL ?? null);
          setLoading(false);
          return;
        }
        if (profileDoc.visibility === "private" && !isOwnProfile) {
          setProfile("private");
        } else {
          setProfile(profileDoc);
          setDisplayName(userDoc?.displayName ?? null);
          setPhotoURL(userDoc?.photoURL ?? null);
        }
      } catch {
        setProfile("private");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, isOwnProfile]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (profile === "private" || !profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-white">
          {profile === "private" ? "This profile is private" : "Profile not found"}
        </h1>
        <p className="mt-2 text-zinc-400">
          {profile === "private"
            ? "The owner has set their profile to private."
            : "This profile does not exist or has not been set up yet."}
        </p>
      </div>
    );
  }

  const avatarUrl = photoURL ?? null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Profile"
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-500">
              {displayName?.[0] ?? "?"}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{displayName ?? "Anonymous"}</h1>
          {profile.headline && (
            <p className="mt-1 text-zinc-300">{profile.headline}</p>
          )}
        </div>
      </div>

      {profile.bio && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-semibold text-white">About</h2>
          <p className="text-zinc-400 whitespace-pre-wrap">{profile.bio}</p>
        </section>
      )}

      {profile.experience && profile.experience.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-white">Experience</h2>
          <ul className="space-y-4">
            {profile.experience.map((exp, i) => (
              <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="font-medium text-white">{exp.role}</p>
                <p className="text-sm text-zinc-400">{exp.company}</p>
                <p className="text-xs text-zinc-500">
                  {exp.startDate}
                  {exp.current ? " – Present" : exp.endDate ? ` – ${exp.endDate}` : ""}
                </p>
                {exp.description && (
                  <p className="mt-2 text-sm text-zinc-400">{exp.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.education && profile.education.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-white">Education</h2>
          <ul className="space-y-4">
            {profile.education.map((ed, i) => (
              <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="font-medium text-white">{ed.degree}</p>
                <p className="text-sm text-zinc-400">{ed.school}</p>
                {ed.field && <p className="text-sm text-zinc-500">{ed.field}</p>}
                <p className="text-xs text-zinc-500">{ed.startDate}{ed.endDate ? ` – ${ed.endDate}` : ""}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.projects && profile.projects.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-white">Projects</h2>
          <ul className="space-y-4">
            {profile.projects.map((proj, i) => (
              <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="font-medium text-white">{proj.name}</p>
                {proj.description && <p className="mt-1 text-sm text-zinc-400">{proj.description}</p>}
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-blue-400 hover:underline">
                    {proj.link}
                  </a>
                )}
                {proj.techStack && proj.techStack.length > 0 && (
                  <p className="mt-1 text-xs text-zinc-500">{proj.techStack.join(", ")}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.certifications && profile.certifications.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-white">Certifications</h2>
          <ul className="space-y-3">
            {profile.certifications.map((cert, i) => (
              <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="font-medium text-white">{cert.name}</p>
                <p className="text-sm text-zinc-400">{cert.issuer}</p>
                <p className="text-xs text-zinc-500">{cert.date}</p>
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-blue-400 hover:underline">
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.skills && profile.skills.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-white">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span key={i} className="rounded-full bg-zinc-700 px-3 py-1 text-sm text-zinc-200">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {(profile.links?.github || profile.links?.linkedin || profile.links?.portfolio) && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-white">Links</h2>
          <div className="flex flex-wrap gap-4">
            {profile.links.github && (
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                GitHub
              </a>
            )}
            {profile.links.linkedin && (
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            )}
            {profile.links.portfolio && (
              <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Portfolio
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
