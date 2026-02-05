"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1 text-sm text-zinc-200"
          >
            {s}
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="ml-1 text-zinc-400 hover:text-white"
              aria-label={`Remove ${s}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          placeholder="Add a skill (e.g. System Design)"
          className="flex-1 rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Button type="button" variant="outline" size="sm" onClick={addSkill}>
          Add
        </Button>
      </div>
    </div>
  );
}
