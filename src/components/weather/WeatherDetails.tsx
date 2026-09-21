import {
  CloudRain,
  Compass,
  Droplets,
  Gauge,
  SunMedium,
  Thermometer,
  Wind,
} from 'lucide-react';

import { WeatherDetailsCard } from './WeatherDetailsCard';

interface WeatherDetailsProps {
  uvIndex?: number;
  windSpeed: number;
  windDirection?: string;
  humidity: number;
  pressure?: number;
  precipitation?: number;
  dewPoint?: number;
  visibility?: number;
  unit?: 'celsius' | 'fahrenheit';
}

export function WeatherDetails({
  uvIndex,
  windSpeed,
  windDirection,
  humidity,
  pressure,
  precipitation,
  dewPoint,
  visibility,
  unit = 'celsius',
}: WeatherDetailsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-semibold">Weather Details</h2>
        <p className="text-xs text-muted-foreground">
          More conditions for the selected location.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <WeatherDetailsCard
          label="UV Index"
          value={
            uvIndex !== undefined ? String(uvIndex) : '—'
          }
          icon={SunMedium}
          description={
            uvIndex !== undefined
              ? uvDescription(uvIndex)
              : undefined
          }
        />

        <WeatherDetailsCard
          label="Wind"
          value={`${windSpeed} km/h`}
          icon={Wind}
          description={windDirection ?? 'Direction unavailable'}
        />

        <WeatherDetailsCard
          label="Humidity"
          value={`${humidity}%`}
          icon={Droplets}
          description="Relative humidity"
        />

        <WeatherDetailsCard
          label="Pressure"
          value={
            pressure !== undefined
              ? `${pressure} hPa`
              : '—'
          }
          icon={Gauge}
          description="Atmospheric pressure"
        />

        <WeatherDetailsCard
          label="Precipitation"
          value={
            precipitation !== undefined
              ? `${precipitation} mm`
              : '—'
          }
          icon={CloudRain}
          description="Recent/expected precipitation"
        />

        <WeatherDetailsCard
          label="Dew Point"
          value={
            dewPoint !== undefined
              ? `${Math.round(dewPoint)}°${
                  unit === 'celsius' ? 'C' : 'F'
                }`
              : '—'
          }
          icon={Thermometer}
          description="Moisture-related temperature"
        />

        <WeatherDetailsCard
          label="Visibility"
          value={
            visibility !== undefined
              ? `${visibility} km`
              : '—'
          }
          icon={Compass}
          description="Horizontal visibility"
        />
      </div>
    </section>
  );
}

function uvDescription(value: number) {
  if (value <= 2) return 'Low';
  if (value <= 5) return 'Moderate';
  if (value <= 7) return 'High';
  if (value <= 10) return 'Very high';

  return 'Extreme';
}