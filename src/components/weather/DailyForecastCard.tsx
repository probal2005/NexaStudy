import {
  Droplets,
} from 'lucide-react';

import {
  WeatherIcon,
  type WeatherCondition,
} from './WeatherIcon';

export interface DailyForecastItem {
  id: string;
  date: string;
  day: string;
  condition: WeatherCondition;
  description: string;
  high: number;
  low: number;
  precipitationChance?: number;
}

interface DailyForecastCardProps {
  item: DailyForecastItem;
  unit?: 'celsius' | 'fahrenheit';
}

export function DailyForecastCard({
  item,
  unit = 'celsius',
}: DailyForecastCardProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl border bg-card p-4">
      <div className="min-w-0">
        <p className="font-semibold">{item.day}</p>

        <p className="truncate text-xs text-muted-foreground">
          {item.date}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-primary">
          <WeatherIcon
            condition={item.condition}
            size={30}
          />
        </div>

        <div className="hidden min-w-28 sm:block">
          <p className="text-sm font-medium">
            {item.description}
          </p>

          {item.precipitationChance !== undefined && (
            <p className="mt-1 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Droplets className="h-3 w-3" />
              {item.precipitationChance}% precipitation
            </p>
          )}
        </div>
      </div>

      <div className="text-right text-sm">
        <span className="font-semibold">
          {Math.round(item.high)}°{unit === 'celsius' ? 'C' : 'F'}
        </span>

        <span className="ml-2 text-muted-foreground">
          {Math.round(item.low)}°{unit === 'celsius' ? 'C' : 'F'}
        </span>
      </div>
    </div>
  );
}