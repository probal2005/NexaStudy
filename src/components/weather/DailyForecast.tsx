import {
  DailyForecastCard,
  type DailyForecastItem,
} from './DailyForecastCard';

interface DailyForecastProps {
  forecast: DailyForecastItem[];
  unit?: 'celsius' | 'fahrenheit';
}

export function DailyForecast({
  forecast,
  unit = 'celsius',
}: DailyForecastProps) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="font-semibold">7-Day Forecast</h2>
        <p className="text-xs text-muted-foreground">
          Daily highs, lows, and precipitation chances.
        </p>
      </div>

      <div className="space-y-3">
        {forecast.map((item) => (
          <DailyForecastCard
            key={item.id}
            item={item}
            unit={unit}
          />
        ))}
      </div>
    </section>
  );
}