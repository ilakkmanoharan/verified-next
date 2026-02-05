"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { uploadAvatar } from "@/lib/firebase/storage";
import { updateUserRecord } from "@/lib/firebase/firestore";
import type { User } from "firebase/auth";

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_SIZE_MB = 2;

interface AvatarUploadProps {
  user: User;
  currentPhotoURL: string | null;
  onPhotoChange: (url: string | null) => void;
}

export function AvatarUpload({
  user,
  currentPhotoURL,
  onPhotoChange,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadAvatar(user.uid, file);
      await updateUserRecord(user.uid, { photoURL: url });
      onPhotoChange(url);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const displayUrl =
    currentPhotoURL || (user.photoURL ?? null);

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Profile"
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-500">
            {user.displayName?.[0] ?? user.email?.[0] ?? "?"}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading…" : "Change photo"}
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
