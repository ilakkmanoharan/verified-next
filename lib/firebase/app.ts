import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? "";
const isBuild = typeof window === "undefined";
const isValidKey = apiKey.length > 0 && apiKey !== "build-placeholder";
// Use placeholder only during build (SSR) so `next build` succeeds without .env
const effectiveApiKey = isValidKey ? apiKey : isBuild ? "build-placeholder" : "";

if (!isBuild && !effectiveApiKey) {
  throw new Error(
    "Firebase API key is missing. Copy .env.local.example to .env.local and add your Firebase config from Firebase Console → Project settings → Your apps."
  );
}

const firebaseConfig = {
  apiKey: effectiveApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "verified-next.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "verified-next",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "verified-next.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "0",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
