import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./app";

const AVATAR_PATH = (uid: string) => `users/${uid}/avatar`;

export async function uploadAvatar(uid: string, file: File): Promise<string> {
  const path = AVATAR_PATH(uid);
  const storageRef = ref(storage, path);
  await uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });
  return getDownloadURL(storageRef);
}

export async function getAvatarUrl(uid: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, AVATAR_PATH(uid));
    return await getDownloadURL(storageRef);
  } catch {
    return null;
  }
}

export async function deleteAvatar(uid: string): Promise<void> {
  const storageRef = ref(storage, AVATAR_PATH(uid));
  await deleteObject(storageRef);
}
