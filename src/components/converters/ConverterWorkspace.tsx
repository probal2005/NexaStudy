'use client';

import { useMemo, useState } from 'react';
import {
  Binary,
  Clock3,
  Database,
  Gauge,
  LandPlot,
  Ruler,
  Thermometer,
  Weight,
  Boxes,
} from 'lucide-react';

import ConverterHeader from './ConverterHeader';
import ConverterSearch from './ConverterSearch';
import ConverterGrid from './ConverterGrid';
import ConverterCategory from './ConverterCategory';
import ConverterEmptyState from './ConverterEmptyState';

import LengthConverter from './LengthConverter';
import WeightConverter from './WeightConverter';
import TemperatureConverter from './TemperatureConverter';
import AreaConverter from './AreaConverter';
import VolumeConverter from './VolumeConverter';
import SpeedConverter from './SpeedConverter';
import TimeConverter from './TimeConverter';
import DataConverter from './DataConverter';
import NumberSystemConverter from './NumberSystemConverter';

import type { LucideIcon } from 'lucide-react';

export interface ConverterDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

const converters: ConverterDefinition[] = [
  {
    id: 'length',
    title: 'Length',
    description: 'Meters, kilometers, miles, feet and more.',
    category: 'Everyday',
    icon: Ruler,
  },
  {
    id: 'weight',
    title: 'Weight',
    description: 'Grams, kilograms, pounds, ounces and more.',
    category: 'Everyday',
    icon: Weight,
  },
  {
    id: 'temperature',
    title: 'Temperature',
    description: 'Celsius, Fahrenheit and Kelvin.',
    category: 'Everyday',
    icon: Thermometer,
  },
  {
    id: 'area',
    title: 'Area',
    description: 'Square meters, acres, hectares and more.',
    category: 'Everyday',
    icon: LandPlot,
  },
  {
    id: 'volume',
    title: 'Volume',
    description: 'Liters, gallons, cups and cubic units.',
    category: 'Everyday',
    icon: Boxes,
  },
  {
    id: 'speed',
    title: 'Speed',
    description: 'km/h, mph, knots and other speed units.',
    category: 'Everyday',
    icon: Gauge,
  },
  {
    id: 'time',
    title: 'Time',
    description: 'Seconds, minutes, hours, days and weeks.',
    category: 'Everyday',
    icon: Clock3,
  },
  {
    id: 'data',
    title: 'Data',
    description: 'Bits, bytes, KB, MB, GB and TB.',
    category: 'Computing',
    icon: Database,
  },
  {
    id: 'number-system',
    title: 'Number System',
    description: 'Binary, octal, decimal and hexadecimal.',
    category: 'Computing',
    icon: Binary,
  },
];

export default function ConverterWorkspace() {
  const [search, setSearch] = useState('');
  const [activeConverter, setActiveConverter] = useState('length');

  const filteredConverters = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return converters;

    return converters.filter((converter) =>
      `${converter.title} ${converter.description} ${converter.category}`
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const active = converters.find(
    (converter) => converter.id === activeConverter,
  );

  const visibleActive = filteredConverters.some(
    (converter) => converter.id === activeConverter,
  );

  const selectConverter = (id: string) => {
    setActiveConverter(id);
  };

  const reset = () => {
    setSearch('');
    setActiveConverter('length');
  };

  return (
    <div className="space-y-6">
      <ConverterHeader onReset={reset} />

      <div className="px-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <ConverterSearch
            value={search}
            onChange={setSearch}
          />

          {filteredConverters.length > 0 ? (
            <>
              <ConverterCategory
                title="Available Converters"
                count={filteredConverters.length}
              >
                <ConverterGrid
                  converters={filteredConverters}
                  activeConverter={activeConverter}
                  onSelect={selectConverter}
                />
              </ConverterCategory>

              {visibleActive && active && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {active.title} Converter
                    </h2>

                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {active.category}
                    </span>
                  </div>

                  <ConverterRenderer id={active.id} />
                </section>
              )}
            </>
          ) : (
            <ConverterEmptyState
              searched
              onReset={() => setSearch('')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ConverterRenderer({ id }: { id: string }) {
  switch (id) {
    case 'length':
      return <LengthConverter />;

    case 'weight':
      return <WeightConverter />;

    case 'temperature':
      return <TemperatureConverter />;

    case 'area':
      return <AreaConverter />;

    case 'volume':
      return <VolumeConverter />;

    case 'speed':
      return <SpeedConverter />;

    case 'time':
      return <TimeConverter />;

    case 'data':
      return <DataConverter />;

    case 'number-system':
      return <NumberSystemConverter />;

    default:
      return null;
  }
}