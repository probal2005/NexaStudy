import {
  Archive,
  FileText,
  Heart,
  Pin,
} from 'lucide-react';

import { NotesStatCard } from './NotesStatCard';

export interface NotesStatsData {
  total: number;
  pinned: number;
  favorites: number;
  archived: number;
}

interface NotesStatsProps {
  stats: NotesStatsData;
}

export function NotesStats({ stats }: NotesStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <NotesStatCard
        title="Total Notes"
        value={stats.total}
        description="All your notes"
        icon={FileText}
      />

      <NotesStatCard
        title="Pinned"
        value={stats.pinned}
        description="Quick-access notes"
        icon={Pin}
      />

      <NotesStatCard
        title="Favorites"
        value={stats.favorites}
        description="Important notes"
        icon={Heart}
      />

      <NotesStatCard
        title="Archived"
        value={stats.archived}
        description="Stored away"
        icon={Archive}
      />
    </div>
  );
}