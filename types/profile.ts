import type { Timestamp } from "firebase/firestore";

export type ProfileVisibility = "public" | "unlisted" | "private";

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectItem {
  id?: string;
  name: string;
  description?: string;
  link?: string;
  techStack?: string[];
}

export interface CertificationItem {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ProfileLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Profile {
  headline?: string | null;
  bio?: string | null;
  visibility: ProfileVisibility;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  skills: string[];
  links: ProfileLinks;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProfileInput {
  headline?: string | null;
  bio?: string | null;
  visibility?: ProfileVisibility;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  skills?: string[];
  links?: ProfileLinks;
}

export const DEFAULT_PROFILE: Omit<Profile, "createdAt" | "updatedAt"> = {
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
