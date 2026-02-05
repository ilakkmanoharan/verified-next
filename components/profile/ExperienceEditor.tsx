"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ExperienceItem } from "@/types/profile";

interface ExperienceEditorProps {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

export function ExperienceEditor({ items, onChange }: ExperienceEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setEditingIndex(null);
    setCompany("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setDescription("");
  };

  const startAdd = () => {
    resetForm();
    setEditingIndex(-1);
  };

  const startEdit = (index: number) => {
    const item = items[index];
    setEditingIndex(index);
    setCompany(item.company);
    setRole(item.role);
    setStartDate(item.startDate);
    setEndDate(item.endDate ?? "");
    setCurrent(item.current ?? false);
    setDescription(item.description ?? "");
  };

  const save = () => {
    if (!company.trim() || !role.trim() || !startDate) return;
    const newItem: ExperienceItem = {
      company: company.trim(),
      role: role.trim(),
      startDate,
      endDate: endDate || undefined,
      current: current || undefined,
      description: description.trim() || undefined,
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
        <div
          key={i}
          className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4"
        >
          <div>
            <p className="font-medium text-white">{item.role}</p>
            <p className="text-sm text-zinc-400">{item.company}</p>
            <p className="text-xs text-zinc-500">
              {item.startDate}
              {item.current ? " – Present" : item.endDate ? " – " + item.endDate : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(i)}>
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      {editingIndex !== null ? (
        <div className="space-y-3 rounded-lg border border-zinc-600 bg-zinc-800/30 p-4">
          <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
          <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Job title" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="e.g. 2020" />
            <Input label="End date" type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="e.g. 2023" disabled={current} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="rounded border-zinc-600 bg-zinc-800" />
            <span className="text-sm text-zinc-300">I currently work here</span>
          </label>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={2}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={save}>Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={startAdd}>
          + Add experience
        </Button>
      )}
    </div>
  );
}
