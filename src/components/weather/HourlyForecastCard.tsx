import {
  WeatherIcon,
  type WeatherCondition,
} from './WeatherIcon';

export interface HourlyForecastItem {
  id: string;
  time: string;
  temperature: number;
  condition: WeatherCondition;
  precipitationChance?: number;
}

interface HourlyForecastCardProps {
  item: HourlyForecastItem;
  unit?: 'celsius' | 'fahrenheit';
  isCurrent?: boolean;
}

export function HourlyForecastCard({
  item,
  unit = 'celsius',
  isCurrent = false,
}: HourlyForecastCardProps) {
  return (
    <div
      className={`min-w-[92px] rounded-xl border p-3 text-center ${
        isCurrent
          ? 'border-primary bg-primary/5'
          : 'bg-card'
      }`}
    >
      <p className="text-xs font-medium text-muted-foreground">
        {item.time}
      </p>

      <div className="my-3 flex justify-center text-primary">
        <WeatherIcon
          condition={item.condition}
          size={28}
        />
      </div>

      <p className="font-semibold">
        {Math.round(item.temperature)}°
        {unit === 'celsius' ? 'C' : 'F'}
      </p>

      {item.precipitationChance !== undefined && (
        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          {item.precipitationChance}% rain
        </p>
      )}
    </div>
  );
}