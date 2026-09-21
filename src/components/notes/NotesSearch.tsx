'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface NotesSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NotesSearch({
  value,
  onChange,
  placeholder = 'Search notes, subjects, tags...',
}: NotesSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-10"
        aria-label="Search notes"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear note search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}