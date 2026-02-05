"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/app";
import {
  signUp as firebaseSignUp,
  signIn as firebaseSignIn,
  signOut as firebaseSignOut,
  signInWithGoogle as firebaseSignInWithGoogle,
  type User,
} from "@/lib/firebase/auth";
import {
  getUserDoc,
  createUserRecord,
  createProfileRecord,
} from "@/lib/firebase/firestore";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /** Set when Firestore rules are missing or deny access; user can still be signed in */
  firestoreError: Error | null;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState<Error | null>(null);
  const router = useRouter();

  const ensureUserAndProfile = useCallback(async (uid: string, email: string, displayName?: string | null, photoURL?: string | null) => {
    setFirestoreError(null);
    try {
      const existingUser = await getUserDoc(uid);
      if (!existingUser) {
        await createUserRecord(uid, {
          email,
          displayName: displayName ?? null,
          photoURL: photoURL ?? null,
          role: "candidate",
        });
        await createProfileRecord(uid);
      }
    } catch (e) {
      setFirestoreError(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setFirestoreError(null);
      if (firebaseUser) {
        await ensureUserAndProfile(
          firebaseUser.uid,
          firebaseUser.email ?? "",
          firebaseUser.displayName ?? null,
          firebaseUser.photoURL ?? null
        );
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [ensureUserAndProfile]);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const cred = await firebaseSignUp(email, password, displayName);
      await createUserRecord(cred.user.uid, {
        email: cred.user.email ?? email,
        displayName: cred.user.displayName ?? displayName ?? null,
        photoURL: cred.user.photoURL ?? null,
        role: "candidate",
      });
      await createProfileRecord(cred.user.uid);
      router.push("/profile");
    },
    [router]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const cred = await firebaseSignIn(email, password);
      await ensureUserAndProfile(
        cred.user.uid,
        cred.user.email ?? email,
        cred.user.displayName ?? null,
        cred.user.photoURL ?? null
      );
      router.push("/");
    },
    [router, ensureUserAndProfile]
  );

  const signInWithGoogle = useCallback(async () => {
    const cred = await firebaseSignInWithGoogle();
    await ensureUserAndProfile(
      cred.user.uid,
      cred.user.email ?? "",
      cred.user.displayName ?? null,
      cred.user.photoURL ?? null
    );
    router.push("/");
  }, [router, ensureUserAndProfile]);

  const signOut = useCallback(async () => {
    await firebaseSignOut();
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      firestoreError,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
    }),
    [user, loading, firestoreError, signUp, signIn, signOut, signInWithGoogle]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
