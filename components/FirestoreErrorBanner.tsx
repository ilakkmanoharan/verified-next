"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function FirestoreErrorBanner() {
  const { firestoreError } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!firestoreError || dismissed) return null;

  const isPermissionError =
    firestoreError.message?.includes("permission") ||
    firestoreError.message?.includes("insufficient");

  return (
    <div
      role="alert"
      className="border-b border-amber-700 bg-amber-900/90 px-4 py-2 text-sm text-amber-100"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <span>
          {isPermissionError ? (
            <>
              Firestore permission denied. In Firebase Console go to Firestore
              Database → Rules, paste the rules from{" "}
              <code className="rounded bg-amber-800 px-1">firestore.rules</code>{" "}
              in this project, then click Publish.
            </>
          ) : (
            firestoreError.message
          )}
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded px-2 py-1 hover:bg-amber-800"
          aria-label="Dismiss"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
