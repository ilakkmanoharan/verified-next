import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type DocumentReference,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./app";
import type { UserRecord, UserRecordInput } from "@/types/user";
import type { Profile, ProfileInput } from "@/types/profile";

export function getUserRef(uid: string): DocumentReference {
  return doc(db, "users", uid);
}

export function getProfileRef(uid: string): DocumentReference {
  return doc(db, "profiles", uid);
}

export async function getUserDoc(uid: string): Promise<UserRecord | null> {
  const ref = getUserRef(uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserRecord) : null;
}

export async function getProfileDoc(uid: string): Promise<Profile | null> {
  const ref = getProfileRef(uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Profile) : null;
}

export async function createUserRecord(
  uid: string,
  input: UserRecordInput
): Promise<void> {
  const ref = getUserRef(uid);
  const now = serverTimestamp() as Timestamp;
  await setDoc(ref, {
    email: input.email,
    displayName: input.displayName ?? null,
    photoURL: input.photoURL ?? null,
    role: input.role ?? "candidate",
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateUserRecord(
  uid: string,
  data: Partial<Pick<UserRecord, "displayName" | "photoURL">>
): Promise<void> {
  const ref = getUserRef(uid);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function createProfileRecord(uid: string): Promise<void> {
  const ref = getProfileRef(uid);
  const now = serverTimestamp() as Timestamp;
  await setDoc(ref, {
    headline: null,
    bio: null,
    visibility: "public",
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    skills: [],
    links: {},
    createdAt: now,
    updatedAt: now,
  });
}

export async function setProfile(uid: string, data: ProfileInput): Promise<void> {
  const ref = getProfileRef(uid);
  const links = data.links
    ? {
        ...(data.links.github != null && { github: data.links.github }),
        ...(data.links.linkedin != null && { linkedin: data.links.linkedin }),
        ...(data.links.portfolio != null && { portfolio: data.links.portfolio }),
      }
    : {};
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (data.headline !== undefined) payload.headline = data.headline;
  if (data.bio !== undefined) payload.bio = data.bio;
  if (data.visibility !== undefined) payload.visibility = data.visibility;
  if (data.experience !== undefined) payload.experience = data.experience;
  if (data.education !== undefined) payload.education = data.education;
  if (data.projects !== undefined) payload.projects = data.projects;
  if (data.certifications !== undefined) payload.certifications = data.certifications;
  if (data.skills !== undefined) payload.skills = data.skills;
  if (Object.keys(links).length > 0) payload.links = links;
  await setDoc(ref, payload, { merge: true });
}
