'use client';

import ConverterCard from './ConverterCard';

import type { ConverterDefinition } from './ConverterWorkspace';

interface ConverterGridProps {
  converters: ConverterDefinition[];
  activeConverter: string;
  onSelect: (id: string) => void;
}

export default function ConverterGrid({
  converters,
  activeConverter,
  onSelect,
}: ConverterGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {converters.map((converter) => (
        <ConverterCard
          key={converter.id}
          title={converter.title}
          description={converter.description}
          icon={converter.icon}
          active={activeConverter === converter.id}
          onClick={() => onSelect(converter.id)}
        />
      ))}
    </div>
  );
}