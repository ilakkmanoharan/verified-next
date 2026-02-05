"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ProjectItem } from "@/types/profile";

interface ProjectsEditorProps {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
}

export function ProjectsEditor({ items, onChange }: ProjectsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [techStack, setTechStack] = useState("");

  const resetForm = () => {
    setEditingIndex(null);
    setName("");
    setDescription("");
    setLink("");
    setTechStack("");
  };

  const startAdd = () => {
    resetForm();
    setEditingIndex(-1);
  };

  const startEdit = (index: number) => {
    const item = items[index];
    setEditingIndex(index);
    setName(item.name);
    setDescription(item.description ?? "");
    setLink(item.link ?? "");
    setTechStack((item.techStack ?? []).join(", "));
  };

  const save = () => {
    if (!name.trim()) return;
    const tech = techStack.split(",").map((s) => s.trim()).filter(Boolean);
    const newItem: ProjectItem = {
      name: name.trim(),
      description: description.trim() || undefined,
      link: link.trim() || undefined,
      techStack: tech.length ? tech : undefined,
    };
    if (editingIndex === -1) {
      onChange([...items, newItem]);
    } else if (editingIndex !== null) {
      const next = [...items];
      next[editingIndex] = newItem;
      onChange(next);
    }
    resetForm();
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    if (editingIndex === index) resetForm();
    else if (editingIndex !== null && editingIndex > index)
      setEditingIndex(editingIndex - 1);
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
          <div>
            <p className="font-medium text-white">{item.name}</p>
            {item.description && <p className="mt-1 text-sm text-zinc-400">{item.description}</p>}
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-blue-400 hover:underline">{item.link}</a>
            )}
            {item.techStack && item.techStack.length > 0 && (
              <p className="mt-1 text-xs text-zinc-500">{item.techStack.join(", ")}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(i)}>Edit</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">Remove</Button>
          </div>
        </div>
      ))}

      {editingIndex !== null ? (
        <div className="space-y-3 rounded-lg border border-zinc-600 bg-zinc-800/30 p-4">
          <Input label="Project name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" rows={2} className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <Input label="Link (optional)" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          <Input label="Tech stack (comma-separated)" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js" />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={save}>Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={startAdd}>+ Add project</Button>
      )}
    </div>
  );
}
