import {
  Atom,
  BookOpen,
  Code2,
  Database,
  FlaskConical,
  Globe2,
} from 'lucide-react';

import { NoteCategoryCard } from './NoteCategoryCard';

interface NotesCategory {
  name: string;
  count: number;
}

interface NotesCategoriesProps {
  categories: NotesCategory[];
  onSelect?: (category: string) => void;
}

const icons = [
  Code2,
  Database,
  BookOpen,
  Atom,
  FlaskConical,
  Globe2,
];

export function NotesCategories({
  categories,
  onSelect,
}: NotesCategoriesProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">
          Organize notes by subject or topic.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((category, index) => {
          const Icon = icons[index % icons.length];

          return (
            <NoteCategoryCard
              key={category.name}
              name={category.name}
              count={category.count}
              icon={Icon}
              onClick={() => onSelect?.(category.name)}
            />
          );
        })}
      </div>
    </section>
  );
}