import {
  Atom,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  FlaskConical,
  Globe2,
} from 'lucide-react';

import { LibraryCategoryCard } from './LibraryCategoryCard';

interface Category {
  name: string;
  count: number;
}

interface LibraryCategoriesProps {
  categories: Category[];
  onSelect?: (category: string) => void;
}

const icons = [
  Code2,
  BookOpen,
  FlaskConical,
  Atom,
  Globe2,
  BriefcaseBusiness,
];

export function LibraryCategories({
  categories,
  onSelect,
}: LibraryCategoriesProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">
          Browse your resources by subject.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((category, index) => {
          const Icon = icons[index % icons.length];

          return (
            <LibraryCategoryCard
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