import type { Timestamp } from "firebase/firestore";

export type UserRole = "candidate" | "employer" | "admin";

export interface UserRecord {
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserRecordInput {
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  role?: UserRole;
}
