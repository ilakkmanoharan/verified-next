"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { CertificationItem } from "@/types/profile";

interface CertificationsEditorProps {
  items: CertificationItem[];
  onChange: (items: CertificationItem[]) => void;
}

export function CertificationsEditor({ items, onChange }: CertificationsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");

  const resetForm = () => {
    setEditingIndex(null);
    setName("");
    setIssuer("");
    setDate("");
    setLink("");
  };

  const startAdd = () => {
    resetForm();
    setEditingIndex(-1);
  };

  const startEdit = (index: number) => {
    const item = items[index];
    setEditingIndex(index);
    setName(item.name);
    setIssuer(item.issuer);
    setDate(item.date);
    setLink(item.link ?? "");
  };

  const save = () => {
    if (!name.trim() || !issuer.trim() || !date.trim()) return;
    const newItem: CertificationItem = {
      name: name.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      link: link.trim() || undefined,
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
            <p className="text-sm text-zinc-400">{item.issuer}</p>
            <p className="text-xs text-zinc-500">{item.date}</p>
            {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-blue-400 hover:underline">View</a>}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(i)}>Edit</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">Remove</Button>
          </div>
        </div>
      ))}

      {editingIndex !== null ? (
        <div className="space-y-3 rounded-lg border border-zinc-600 bg-zinc-800/30 p-4">
          <Input label="Certification name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AWS Solutions Architect" />
          <Input label="Issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="e.g. Amazon Web Services" />
          <Input label="Date" type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. 2023" />
          <Input label="Link (optional)" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={save}>Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={startAdd}>+ Add certification</Button>
      )}
    </div>
  );
}
