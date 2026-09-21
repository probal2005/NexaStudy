'use client';

interface ConverterCategoryProps {
  title: string;
  count?: number;
  children: React.ReactNode;
}

export default function ConverterCategory({
  title,
  count,
  children,
}: ConverterCategoryProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>

        {typeof count === 'number' && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {count}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}