"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { EducationItem } from "@/types/profile";

interface EducationEditorProps {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export function EducationEditor({ items, onChange }: EducationEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const resetForm = () => {
    setEditingIndex(null);
    setSchool("");
    setDegree("");
    setField("");
    setStartDate("");
    setEndDate("");
  };

  const startAdd = () => {
    resetForm();
    setEditingIndex(-1);
  };

  const startEdit = (index: number) => {
    const item = items[index];
    setEditingIndex(index);
    setSchool(item.school);
    setDegree(item.degree);
    setField(item.field ?? "");
    setStartDate(item.startDate);
    setEndDate(item.endDate ?? "");
  };

  const save = () => {
    if (!school.trim() || !degree.trim() || !startDate) return;
    const newItem: EducationItem = {
      school: school.trim(),
      degree: degree.trim(),
      field: field.trim() || undefined,
      startDate,
      endDate: endDate.trim() || undefined,
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
            <p className="font-medium text-white">{item.degree}</p>
            <p className="text-sm text-zinc-400">{item.school}</p>
            {item.field && <p className="text-sm text-zinc-500">{item.field}</p>}
            <p className="text-xs text-zinc-500">{item.startDate}{item.endDate ? " – " + item.endDate : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(i)}>Edit</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">Remove</Button>
          </div>
        </div>
      ))}

      {editingIndex !== null ? (
        <div className="space-y-3 rounded-lg border border-zinc-600 bg-zinc-800/30 p-4">
          <Input label="School" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School or university" />
          <Input label="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. B.S. Computer Science" />
          <Input label="Field (optional)" value={field} onChange={(e) => setField(e.target.value)} placeholder="Field of study" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="e.g. 2016" />
            <Input label="End date" type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="e.g. 2020" />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={save}>Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={startAdd}>+ Add education</Button>
      )}
    </div>
  );
}
