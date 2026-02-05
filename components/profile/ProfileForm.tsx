"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ExperienceEditor } from "@/components/profile/ExperienceEditor";
import { EducationEditor } from "@/components/profile/EducationEditor";
import { ProjectsEditor } from "@/components/profile/ProjectsEditor";
import { CertificationsEditor } from "@/components/profile/CertificationsEditor";
import { SkillsEditor } from "@/components/profile/SkillsEditor";
import { setProfile } from "@/lib/firebase/firestore";
import type { User } from "firebase/auth";
import type {
  Profile,
  ProfileInput,
  ProfileVisibility,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
} from "@/types/profile";

function toFormProfile(p: Profile | null): ProfileInput {
  if (!p) {
    return {
      headline: null,
      bio: null,
      visibility: "public",
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      skills: [],
      links: {},
    };
  }
  return {
    headline: p.headline ?? null,
    bio: p.bio ?? null,
    visibility: p.visibility,
    experience: p.experience ?? [],
    education: p.education ?? [],
    projects: p.projects ?? [],
    certifications: p.certifications ?? [],
    skills: p.skills ?? [],
    links: p.links ?? {},
  };
}

interface ProfileFormProps {
  user: User;
  initialProfile: Profile | null;
  userPhotoURL: string | null;
}

export function ProfileForm({
  user,
  initialProfile,
  userPhotoURL,
}: ProfileFormProps) {
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<ProfileVisibility>("public");
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [links, setLinks] = useState({ github: "", linkedin: "", portfolio: "" });
  const [photoURL, setPhotoURL] = useState<string | null>(userPhotoURL);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const form = toFormProfile(initialProfile);
    setHeadline(form.headline ?? "");
    setBio(form.bio ?? "");
    setVisibility(form.visibility ?? "public");
    setExperience(form.experience ?? []);
    setEducation(form.education ?? []);
    setProjects(form.projects ?? []);
    setCertifications(form.certifications ?? []);
    setSkills(form.skills ?? []);
    setLinks({
      github: form.links?.github ?? "",
      linkedin: form.links?.linkedin ?? "",
      portfolio: form.links?.portfolio ?? "",
    });
  }, [initialProfile]);

  const handleSave = async () => {
    setMessage(null);
    setSaving(true);
    try {
      await setProfile(user.uid, {
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        visibility,
        experience,
        education,
        projects,
        certifications,
        skills,
        links: {
          github: links.github.trim() || undefined,
          linkedin: links.linkedin.trim() || undefined,
          portfolio: links.portfolio.trim() || undefined,
        },
      });
      setMessage({ type: "success", text: "Profile saved." });
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      const isPermission =
        err.message?.includes("permission") ||
        err.message?.includes("insufficient");
      setMessage({
        type: "error",
        text: isPermission
          ? "Permission denied. Publish Firestore rules in Firebase Console (Firestore Database → Rules). See firestore.rules in the project."
          : err.message || "Failed to save. Try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit profile</h1>
          <p className="mt-1 text-zinc-400">Update your professional profile.</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          Save profile
        </Button>
      </div>

      {message && (
        <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>
          {message.text}
        </p>
      )}

      <ProfileSection title="Photo">
        <AvatarUpload
          user={user}
          currentPhotoURL={photoURL}
          onPhotoChange={setPhotoURL}
        />
      </ProfileSection>

      <ProfileSection title="Headline & Bio">
        <div className="space-y-4">
          <Input
            label="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short summary about you"
              rows={4}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Profile visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as ProfileVisibility)}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Experience">
        <ExperienceEditor items={experience} onChange={setExperience} />
      </ProfileSection>

      <ProfileSection title="Education">
        <EducationEditor items={education} onChange={setEducation} />
      </ProfileSection>

      <ProfileSection title="Projects">
        <ProjectsEditor items={projects} onChange={setProjects} />
      </ProfileSection>

      <ProfileSection title="Certifications">
        <CertificationsEditor items={certifications} onChange={setCertifications} />
      </ProfileSection>

      <ProfileSection title="Skills">
        <SkillsEditor skills={skills} onChange={setSkills} />
      </ProfileSection>

      <ProfileSection title="Links">
        <div className="space-y-3">
          <Input
            label="GitHub"
            type="url"
            value={links.github}
            onChange={(e) => setLinks((l) => ({ ...l, github: e.target.value }))}
            placeholder="https://github.com/..."
          />
          <Input
            label="LinkedIn"
            type="url"
            value={links.linkedin}
            onChange={(e) => setLinks((l) => ({ ...l, linkedin: e.target.value }))}
            placeholder="https://linkedin.com/in/..."
          />
          <Input
            label="Portfolio"
            type="url"
            value={links.portfolio}
            onChange={(e) => setLinks((l) => ({ ...l, portfolio: e.target.value }))}
            placeholder="https://..."
          />
        </div>
      </ProfileSection>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={saving}>
          Save profile
        </Button>
      </div>
    </div>
  );
}
