"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link as StyledLink } from "@/components/ui/Link";

export function LoginForm() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: unknown) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Sign in with Google failed.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        required
        autoComplete="current-password"
      />

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" fullWidth isLoading={isLoading}>
        Log in
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleGoogle}
        disabled={isLoading}
      >
        Log in with Google
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <StyledLink href="/signup">Sign up</StyledLink>
      </p>
    </form>
  );
}
