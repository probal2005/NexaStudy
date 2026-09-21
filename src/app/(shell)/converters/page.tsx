'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Binary,
  Clock,
  HardDrive,
  Package,
  Ruler,
  Thermometer,
  Weight,
  Globe,
  AlertCircle,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Input';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';

type ConverterIcon = React.ComponentType<{
  size?: number;
  className?: string;
}>;

type NumericConverter = {
  type: 'numeric';
  name: string;
  icon: ConverterIcon;
  units: string[];
  factors: Record<string, number>;
  precision?: number;
  emptyMessage: string;
};

type TemperatureConverter = {
  type: 'temperature';
  name: string;
  icon: ConverterIcon;
  units: string[];
  precision?: number;
  emptyMessage: string;
};

type NumberSystemConverter = {
  type: 'number-system';
  name: string;
  icon: ConverterIcon;
  units: string[];
  emptyMessage: string;
};

type ConverterCategory =
  | NumericConverter
  | TemperatureConverter
  | NumberSystemConverter;

const CATEGORIES: ConverterCategory[] = [
  {
    type: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    precision: 2,
    emptyMessage: 'Enter a temperature value to convert',
  },

  {
    type: 'numeric',
    name: 'Length',
    icon: Ruler,
    units: [
      'Meter',
      'Kilometer',
      'Centimeter',
      'Millimeter',
      'Inch',
      'Foot',
      'Yard',
      'Mile',
    ],
    factors: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Inch: 0.0254,
      Foot: 0.3048,
      Yard: 0.9144,
      Mile: 1609.344,
    },
    precision: 4,
    emptyMessage: 'Enter a length value to convert',
  },

  {
    type: 'numeric',
    name: 'Weight',
    icon: Weight,
    units: [
      'Kilogram',
      'Gram',
      'Milligram',
      'Pound',
      'Ounce',
    ],
    factors: {
      Kilogram: 1,
      Gram: 0.001,
      Milligram: 0.000001,
      Pound: 0.45359237,
      Ounce: 0.028349523125,
    },
    precision: 4,
    emptyMessage: 'Enter a weight value to convert',
  },

  {
    type: 'numeric',
    name: 'Area',
    icon: Ruler,
    units: [
      'Square Meter',
      'Square Kilometer',
      'Square Foot',
      'Acre',
      'Hectare',
    ],
    factors: {
      'Square Meter': 1,
      'Square Kilometer': 1_000_000,
      'Square Foot': 0.09290304,
      Acre: 4046.8564224,
      Hectare: 10_000,
    },
    precision: 4,
    emptyMessage: 'Enter an area value to convert',
  },

  {
    type: 'numeric',
    name: 'Volume',
    icon: Package,
    units: [
      'Liter',
      'Milliliter',
      'Cubic Meter',
      'Gallon',
    ],
    factors: {
      Liter: 1,
      Milliliter: 0.001,
      'Cubic Meter': 1000,
      Gallon: 3.785411784,
    },
    precision: 4,
    emptyMessage: 'Enter a volume value to convert',
  },

  {
    type: 'numeric',
    name: 'Speed',
    icon: ArrowLeftRight,
    units: ['m/s', 'km/h', 'mph'],
    factors: {
      'm/s': 1,
      'km/h': 1 / 3.6,
      mph: 0.44704,
    },
    precision: 4,
    emptyMessage: 'Enter a speed value to convert',
  },

  {
    type: 'numeric',
    name: 'Time',
    icon: Clock,
    units: ['Second', 'Minute', 'Hour', 'Day'],
    factors: {
      Second: 1,
      Minute: 60,
      Hour: 3600,
      Day: 86400,
    },
    precision: 6,
    emptyMessage: 'Enter a time value to convert',
  },

  {
    type: 'numeric',
    name: 'Data',
    icon: HardDrive,
    units: [
      'Bit',
      'Byte',
      'KB',
      'MB',
      'GB',
      'TB',
    ],
    factors: {
      Bit: 1 / 8,
      Byte: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
    },
    precision: 6,
    emptyMessage: 'Enter a data value to convert',
  },

  {
    type: 'number-system',
    name: 'Number Systems',
    icon: Binary,
    units: [
      'Binary',
      'Decimal',
      'Octal',
      'Hexadecimal',
    ],
    emptyMessage:
      'Enter a number to convert between number systems',
  },
];

function formatNumber(
  value: number,
  precision = 4,
) {
  if (!Number.isFinite(value)) {
    return 'Invalid';
  }

  if (Object.is(value, -0)) {
    return '0';
  }

  return Number(
    value.toFixed(precision),
  ).toString();
}

function parseFiniteNumber(
  value: string,
) {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function convertTemperature(
  value: number,
  from: string,
  to: string,
) {
  let celsius: number;

  switch (from) {
    case 'Celsius':
      celsius = value;
      break;

    case 'Fahrenheit':
      celsius = (value - 32) * (5 / 9);
      break;

    case 'Kelvin':
      celsius = value - 273.15;
      break;

    default:
      return NaN;
  }

  switch (to) {
    case 'Celsius':
      return celsius;

    case 'Fahrenheit':
      return celsius * (9 / 5) + 32;

    case 'Kelvin':
      return celsius + 273.15;

    default:
      return NaN;
  }
}

function getNumberSystemBase(
  unit: string,
) {
  switch (unit) {
    case 'Binary':
      return 2;

    case 'Decimal':
      return 10;

    case 'Octal':
      return 8;

    case 'Hexadecimal':
      return 16;

    default:
      return null;
  }
}

function validateNumberSystemInput(
  value: string,
  unit: string,
) {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      valid: false,
      message: 'Enter a value first.',
    };
  }

  const patterns: Record<
    string,
    RegExp
  > = {
    Binary: /^[01]+$/,
    Decimal: /^-?\d+$/,
    Octal: /^[0-7]+$/,
    Hexadecimal: /^[0-9a-fA-F]+$/,
  };

  const pattern = patterns[unit];

  if (!pattern?.test(trimmed)) {
    return {
      valid: false,
      message: `Invalid ${unit.toLowerCase()} value.`,
    };
  }

  if (
    unit !== 'Decimal' &&
    trimmed.startsWith('-')
  ) {
    return {
      valid: false,
      message: `${unit} input cannot be negative in this converter.`,
    };
  }

  return {
    valid: true,
    message: '',
  };
}

function convertNumberSystem(
  value: string,
  from: string,
  to: string,
) {
  const validation =
    validateNumberSystemInput(
      value,
      from,
    );

  if (!validation.valid) {
    return {
      result: null,
      error: validation.message,
    };
  }

  const fromBase =
    getNumberSystemBase(from);

  const toBase =
    getNumberSystemBase(to);

  if (!fromBase || !toBase) {
    return {
      result: null,
      error: 'Unsupported number system.',
    };
  }

  const decimal = parseInt(
    value.trim(),
    fromBase,
  );

  if (!Number.isSafeInteger(decimal)) {
    return {
      result: null,
      error:
        'The value is too large for safe browser conversion.',
    };
  }

  const result =
    toBase === 10
      ? String(decimal)
      : decimal
          .toString(toBase)
          .toUpperCase();

  return {
    result,
    error: null,
  };
}

function convertValue(
  category: ConverterCategory,
  value: string,
  from: string,
  to: string,
) {
  if (category.type === 'number-system') {
    return convertNumberSystem(
      value,
      from,
      to,
    );
  }

  const numericValue =
    parseFiniteNumber(value);

  if (numericValue === null) {
    return {
      result: null,
      error: null,
    };
  }

  if (category.type === 'temperature') {
    const converted =
      convertTemperature(
        numericValue,
        from,
        to,
      );

    return {
      result: Number.isFinite(converted)
        ? formatNumber(
            converted,
            category.precision,
          )
        : null,
      error: null,
    };
  }

  const fromFactor =
    category.factors[from];

  const toFactor =
    category.factors[to];

  if (
    fromFactor === undefined ||
    toFactor === undefined
  ) {
    return {
      result: null,
      error: 'Unsupported unit.',
    };
  }

  const baseValue =
    numericValue * fromFactor;

  const converted =
    baseValue / toFactor;

  return {
    result: formatNumber(
      converted,
      category.precision,
    ),
    error: null,
  };
}

export default function ConvertersPage() {
  const [activeCategory, setActiveCategory] =
    useState(0);

  const [fromUnit, setFromUnit] =
    useState(
      CATEGORIES[0].units[0],
    );

  const [toUnit, setToUnit] =
    useState(
      CATEGORIES[0].units[1],
    );

  const [value, setValue] =
    useState('');

  const category =
    CATEGORIES[activeCategory];

  useEffect(() => {
    setFromUnit(category.units[0]);
    setToUnit(
      category.units[1] ??
        category.units[0],
    );
    setValue('');
  }, [activeCategory, category]);

  const conversion = useMemo(
    () =>
      convertValue(
        category,
        value,
        fromUnit,
        toUnit,
      ),
    [
      category,
      value,
      fromUnit,
      toUnit,
    ],
  );

  const result =
    conversion.result;

  const error =
    conversion.error;

  const handleCategoryChange = (
    index: number,
  ) => {
    setActiveCategory(index);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleInputChange = (
    nextValue: string,
  ) => {
    /*
     * Keep the raw string instead of forcing
     * parseFloat() on every keystroke.
     *
     * This allows:
     * 1.
     * 1.
     * -1.5
     * empty input
     * etc.
     */
    setValue(nextValue);
  };

  const getTableValue = (
    unit: string,
  ) => {
    const converted =
      convertValue(
        category,
        value,
        fromUnit,
        unit,
      );

    return converted;
  };

  const hasInput =
    value.trim() !== '';

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <header className="flex shrink-0 flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              Unit Converters
            </h1>

            <Badge
              variant="secondary"
              className="text-[10px]"
            >
              {CATEGORIES.length} tools
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Convert values quickly and accurately
            between common units.
          </p>
        </div>
      </header>

      {/* Main */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
        {/* Category sidebar */}
        <Card className="shrink-0 overflow-hidden lg:w-56">
          <CardContent className="h-full overflow-y-auto p-2">
            <div className="space-y-1">
              {CATEGORIES.map(
                (item, index) => {
                  const Icon =
                    item.icon;

                  const active =
                    activeCategory ===
                    index;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          index,
                        )
                      }
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      )}
                    >
                      <Icon
                        size={17}
                        className="shrink-0"
                      />

                      <span className="text-xs font-medium">
                        {item.name}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>

        {/* Converter */}
        <Card className="min-h-0 flex-1 overflow-y-auto">
          <CardContent className="p-4 sm:p-6">
            {/* Converter title */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {category.name} Converter
                </h2>

                <Badge
                  variant="outline"
                  className="text-[10px]"
                >
                  {category.units.length}{' '}
                  units
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose the source and target
                units, then enter your value.
              </p>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label
                htmlFor="converter-value"
                className="mb-1.5 block text-sm font-medium"
              >
                Value
              </label>

              <Input
                id="converter-value"
                type={
                  category.type ===
                  'number-system'
                    ? 'text'
                    : 'number'
                }
                inputMode={
                  category.type ===
                  'number-system'
                    ? 'text'
                    : 'decimal'
                }
                value={value}
                onChange={(event) =>
                  handleInputChange(
                    event.target.value,
                  )
                }
                placeholder={
                  category.type ===
                  'number-system'
                    ? 'Enter number...'
                    : 'Enter value...'
                }
                className="h-12 font-mono text-lg"
                autoComplete="off"
              />
            </div>

            {/* From / swap / to */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div>
                <label
                  htmlFor="from-unit"
                  className="mb-1.5 block text-sm font-medium"
                >
                  From
                </label>

                <select
                  id="from-unit"
                  value={fromUnit}
                  onChange={(event) =>
                    setFromUnit(
                      event.target.value,
                    )
                  }
                  className="h-11 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {category.units.map(
                    (unit) => (
                      <option
                        key={unit}
                        value={unit}
                      >
                        {unit}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSwap}
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:mb-0"
                aria-label="Swap units"
                title="Swap units"
              >
                <ArrowLeftRight
                  size={16}
                />
              </button>

              <div>
                <label
                  htmlFor="to-unit"
                  className="mb-1.5 block text-sm font-medium"
                >
                  To
                </label>

                <select
                  id="to-unit"
                  value={toUnit}
                  onChange={(event) =>
                    setToUnit(
                      event.target.value,
                    )
                  }
                  className="h-11 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {category.units.map(
                    (unit) => (
                      <option
                        key={unit}
                        value={unit}
                      >
                        {unit}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>
              </div>
            )}

            {/* Result */}
            <div className="rounded-xl border border-border bg-muted/40 p-6 text-center">
              {result !== null &&
              result !== undefined &&
              !error &&
              hasInput ? (
                <>
                  <p className="mb-2 break-all font-mono text-3xl font-bold text-primary sm:text-4xl">
                    {result}
                  </p>

                  <p className="break-all text-sm text-muted-foreground">
                    {value} {fromUnit}{' '}
                    <span className="mx-1">
                      =
                    </span>{' '}
                    {result} {toUnit}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {error
                    ? 'Fix the input to see the conversion result.'
                    : category.emptyMessage}
                </p>
              )}
            </div>

            {/* Conversion table */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  Conversions from{' '}
                  {fromUnit}
                </h3>

                {hasInput && !error && (
                  <span className="text-[10px] text-muted-foreground">
                    Live conversion
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {category.units
                  .filter(
                    (unit) =>
                      unit !== fromUnit,
                  )
                  .map((unit) => {
                    const tableResult =
                      getTableValue(
                        unit,
                      );

                    return (
                      <div
                        key={unit}
                        className="rounded-lg border border-border bg-card p-3 text-center"
                      >
                        <p className="mb-1 text-xs text-muted-foreground">
                          {unit}
                        </p>

                        <p className="break-all font-mono text-base font-semibold">
                          {hasInput &&
                          !tableResult.error &&
                          tableResult.result !==
                            null
                            ? tableResult.result
                            : '—'}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Number-system hint */}
            {category.type ===
              'number-system' && (
              <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-2 text-xs font-semibold">
                  Accepted formats
                </p>

                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <span>
                    Binary: <code>101101</code>
                  </span>

                  <span>
                    Decimal: <code>45</code>
                  </span>

                  <span>
                    Octal: <code>55</code>
                  </span>

                  <span>
                    Hexadecimal:{' '}
                    <code>2D</code>
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Currency note */}
      <Card className="mt-4 shrink-0">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <Globe
              size={16}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />

            <div className="text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Currency conversion:
                </span>{' '}
                this converter currently handles
                physical units and number systems.
                Live currency rates require an
                external exchange-rate API.
              </p>

              <a
                href="/settings"
                className="mt-1 inline-block text-primary hover:underline"
              >
                Configure integrations in
                Settings →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}