import {
  HourlyForecastCard,
  type HourlyForecastItem,
} from './HourlyForecastCard';

interface HourlyForecastProps {
  forecast: HourlyForecastItem[];
  unit?: 'celsius' | 'fahrenheit';
}

export function HourlyForecast({
  forecast,
  unit = 'celsius',
}: HourlyForecastProps) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="font-semibold">Hourly Forecast</h2>
        <p className="text-xs text-muted-foreground">
          Weather throughout the next several hours.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {forecast.map((item, index) => (
          <HourlyForecastCard
            key={item.id}
            item={item}
            unit={unit}
            isCurrent={index === 0}
          />
        ))}
      </div>
    </section>
  );
}