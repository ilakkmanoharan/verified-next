"use client";

export type DashboardTab = "overview" | "tests" | "projects";

interface DashboardTabsProps {
  active: DashboardTab;
  onSelect: (tab: DashboardTab) => void;
}

const TABS: { id: DashboardTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "tests", label: "Tests" },
  { id: "projects", label: "Projects" },
];

export function DashboardTabs({ active, onSelect }: DashboardTabsProps) {
  return (
    <div className="border-b border-zinc-800">
      <nav className="flex gap-1" aria-label="Dashboard tabs">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active === id
                ? "border-blue-500 text-white"
                : "border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
