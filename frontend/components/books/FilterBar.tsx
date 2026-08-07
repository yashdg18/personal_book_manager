'use client';

import { Search } from 'lucide-react';
import { BookStatus } from '@/types/book';

const STATUSES: (BookStatus | 'All')[] = ['All', 'Want to Read', 'Reading', 'Completed'];

interface FilterBarProps {
  status: BookStatus | 'All';
  onStatusChange: (status: BookStatus | 'All') => void;
  search: string;
  onSearchChange: (search: string) => void;
  tags: string;
  onTagsChange: (tags: string) => void;
}

export function FilterBar({
  status,
  onStatusChange,
  search,
  onSearchChange,
  tags,
  onTagsChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm
            outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as BookStatus | 'All')}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-accent/50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <input
        value={tags}
        onChange={(e) => onTagsChange(e.target.value)}
        placeholder="Tags (comma separated)"
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-accent/50 sm:w-56"
      />
    </div>
  );
}
