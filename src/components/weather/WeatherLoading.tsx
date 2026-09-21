export function WeatherLoading() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading weather"
    >
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>

      <div className="h-44 animate-pulse rounded-xl bg-muted" />

      <span className="sr-only">
        Loading weather data...
      </span>
    </div>
  );
}