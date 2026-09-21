import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock3,
} from 'lucide-react';

import { LibraryStatCard } from './LibraryStatCard';

export interface LibraryStatsData {
  total: number;
  completed: number;
  reading: number;
  favorites: number;
}

interface LibraryStatsProps {
  stats: LibraryStatsData;
}

export function LibraryStats({ stats }: LibraryStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <LibraryStatCard
        title="Total Resources"
        value={stats.total}
        description="Books and study materials"
        icon={BookOpen}
      />

      <LibraryStatCard
        title="Completed"
        value={stats.completed}
        description="Finished resources"
        icon={CheckCircle2}
      />

      <LibraryStatCard
        title="Currently Reading"
        value={stats.reading}
        description="Active resources"
        icon={Clock3}
      />

      <LibraryStatCard
        title="Favorites"
        value={stats.favorites}
        description="Saved for quick access"
        icon={Bookmark}
      />
    </div>
  );
}