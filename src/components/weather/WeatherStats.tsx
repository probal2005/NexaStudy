import {
  Droplets,
  Gauge,
  Thermometer,
  Wind,
} from 'lucide-react';

import { WeatherStatCard } from './WeatherStatCard';

interface WeatherStatsProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure?: number;
  unit?: 'celsius' | 'fahrenheit';
}

export function WeatherStats({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  pressure,
  unit = 'celsius',
}: WeatherStatsProps) {
  const symbol = unit === 'celsius' ? 'C' : 'F';

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <WeatherStatCard
        label="Temperature"
        value={`${Math.round(temperature)}°${symbol}`}
        description="Current"
        icon={Thermometer}
      />

      <WeatherStatCard
        label="Feels Like"
        value={`${Math.round(feelsLike)}°${symbol}`}
        description="Perceived temperature"
        icon={Thermometer}
      />

      <WeatherStatCard
        label="Humidity"
        value={`${humidity}%`}
        description="Relative humidity"
        icon={Droplets}
      />

      <WeatherStatCard
        label="Wind"
        value={`${windSpeed} km/h`}
        description={
          pressure !== undefined
            ? `${pressure} hPa pressure`
            : 'Current speed'
        }
        icon={Wind}
      />
    </div>
  );
}