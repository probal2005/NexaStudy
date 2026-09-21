import {
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Wind,
} from 'lucide-react';

import {
  WeatherIcon,
  type WeatherCondition,
} from './WeatherIcon';

export interface CurrentWeatherData {
  city: string;
  country?: string;
  condition: WeatherCondition;
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection?: string;
  visibility?: number;
  pressure?: number;
  sunrise?: string;
  sunset?: string;
  high?: number;
  low?: number;
  updatedAt?: string;
}

interface CurrentWeatherProps {
  weather: CurrentWeatherData;
  unit?: 'celsius' | 'fahrenheit';
}

function temperature(value: number, unit: 'celsius' | 'fahrenheit') {
  return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

function formatTime(value?: string) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function CurrentWeather({
  weather,
  unit = 'celsius',
}: CurrentWeatherProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-24 sm:w-24">
            <WeatherIcon
              condition={weather.condition}
              size={52}
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Current weather
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {weather.city}
              {weather.country ? `, ${weather.country}` : ''}
            </h2>

            <p className="mt-1 capitalize text-sm text-muted-foreground">
              {weather.description}
            </p>
          </div>
        </div>

        <div className="text-left lg:text-right">
          <div className="text-5xl font-bold tracking-tight">
            {temperature(weather.temperature, unit)}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Feels like{' '}
            {temperature(weather.feelsLike, unit)}
          </p>

          {(weather.high !== undefined ||
            weather.low !== undefined) && (
            <p className="mt-2 text-xs text-muted-foreground">
              H {weather.high !== undefined
                ? temperature(weather.high, unit)
                : '—'}{' '}
              · L {weather.low !== undefined
                ? temperature(weather.low, unit)
                : '—'}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-3 lg:grid-cols-6">
        <WeatherMiniStat
          icon={Droplets}
          label="Humidity"
          value={`${weather.humidity}%`}
        />

        <WeatherMiniStat
          icon={Wind}
          label="Wind"
          value={`${weather.windSpeed} km/h`}
        />

        <WeatherMiniStat
          icon={Eye}
          label="Visibility"
          value={
            weather.visibility !== undefined
              ? `${weather.visibility} km`
              : '—'
          }
        />

        <WeatherMiniStat
          icon={Gauge}
          label="Pressure"
          value={
            weather.pressure !== undefined
              ? `${weather.pressure} hPa`
              : '—'
          }
        />

        <WeatherMiniStat
          icon={Sunrise}
          label="Sunrise"
          value={formatTime(weather.sunrise)}
        />

        <WeatherMiniStat
          icon={Sunset}
          label="Sunset"
          value={formatTime(weather.sunset)}
        />
      </div>
    </section>
  );
}

import type { LucideIcon } from 'lucide-react';

function WeatherMiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}