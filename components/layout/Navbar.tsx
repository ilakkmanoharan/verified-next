"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Link as StyledLink } from "@/components/ui/Link";

export function Navbar() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-semibold text-white">
            Verified
          </Link>
          <div className="h-8 w-24 animate-pulse rounded bg-zinc-700" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-white">
          Verified
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-sm text-zinc-300 hover:text-white"
              >
                Profile
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <StyledLink href="/login">Log in</StyledLink>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
