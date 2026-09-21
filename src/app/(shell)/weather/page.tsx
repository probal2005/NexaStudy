'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplet,
  Eye,
  Gauge,
  MapPin,
  Search,
  Star,
  SunMedium,
  Sunrise,
  Sunset,
  Wind,
  X,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';

interface HourlyForecast {
  time: string;
  temp: number;
  icon: WeatherCondition;
  precipitation: number;
}

interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  icon: WeatherCondition;
  description: string;
}

interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  visibility: number;
  pressure: number;
  description: string;
  icon: WeatherCondition;
}

interface CityWeather {
  city: string;
  country: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  sunrise?: string;
  sunset?: string;
  updatedAt: string;
}

type WeatherCondition =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

interface City {
  name: string;
  country: string;
}

const FAVORITES_KEY = 'nexastudy_weather_favorites_v1';
const RECENT_KEY = 'nexastudy_weather_recent_v1';

const cities: City[] = [
  { name: 'New Delhi', country: 'IN' },
  { name: 'Mumbai', country: 'IN' },
  { name: 'Bangalore', country: 'IN' },
  { name: 'Chennai', country: 'IN' },
  { name: 'Kolkata', country: 'IN' },
  { name: 'Hyderabad', country: 'IN' },
  { name: 'Pune', country: 'IN' },
  { name: 'Jaipur', country: 'IN' },
  { name: 'Ludhiana', country: 'IN' },
  { name: 'Chandigarh', country: 'IN' },
  { name: 'London', country: 'UK' },
  { name: 'New York', country: 'US' },
  { name: 'Tokyo', country: 'JP' },
  { name: 'Sydney', country: 'AU' },
];

const weatherIcons: Record<
  WeatherCondition,
  LucideIcon
> = {
  clear: SunMedium,
  partly_cloudy: CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  heavy_rain: CloudRain,
  thunderstorm: CloudLightning,
  snow: CloudSnow,
  fog: Cloud,
};

const weatherDescriptions: Record<
  WeatherCondition,
  string
> = {
  clear: 'Clear sky',
  partly_cloudy: 'Partly cloudy',
  cloudy: 'Cloudy',
  rain: 'Light rain',
  heavy_rain: 'Heavy rain',
  thunderstorm: 'Thunderstorm',
  snow: 'Snow',
  fog: 'Foggy',
};

const conditionCycle: WeatherCondition[] = [
  'clear',
  'partly_cloudy',
  'cloudy',
  'rain',
  'clear',
  'partly_cloudy',
  'cloudy',
];

function hashString(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash =
      (hash << 5) -
      hash +
      value.charCodeAt(i);

    hash |= 0;
  }

  return Math.abs(hash);
}

function seededNumber(
  seed: number,
  min: number,
  max: number,
) {
  const value =
    Math.abs(
      Math.sin(seed * 12.9898) *
        43758.5453,
    ) % 1;

  return min + value * (max - min);
}

function generateDemoWeather(
  city: string,
  country: string,
): CityWeather {
  const seed = hashString(
    `${city}-${country}`,
  );

  const baseTemp = Math.round(
    seededNumber(seed, 18, 34),
  );

  const currentCondition =
    conditionCycle[seed % conditionCycle.length];

  const now = new Date();

  const hourly: HourlyForecast[] =
    Array.from({ length: 12 }, (_, index) => {
      const hour = new Date(now);

      hour.setHours(
        now.getHours() + index,
        0,
        0,
        0,
      );

      const condition =
        conditionCycle[
          (seed + index) %
            conditionCycle.length
        ];

      return {
        time: hour.toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          },
        ),
        temp: Math.round(
          baseTemp +
            Math.sin(index * 0.5) * 3,
        ),
        icon: condition,
        precipitation:
          condition === 'rain' ||
          condition === 'heavy_rain'
            ? Math.round(
                seededNumber(
                  seed + index,
                  20,
                  75,
                ),
              )
            : 0,
      };
    });

  const daily: DailyForecast[] =
    Array.from({ length: 7 }, (_, index) => {
      const date = new Date();

      date.setDate(
        date.getDate() + index,
      );

      const condition =
        conditionCycle[
          (seed + index) %
            conditionCycle.length
        ];

      const variation = Math.round(
        seededNumber(
          seed + index + 100,
          -2,
          4,
        ),
      );

      return {
        date: date.toISOString(),
        tempMax:
          baseTemp + 4 + variation,
        tempMin:
          baseTemp - 4 + variation,
        icon: condition,
        description:
          weatherDescriptions[
            condition
          ],
      };
    });

  return {
    city,
    country,
    current: {
      temp: baseTemp,
      feelsLike:
        baseTemp +
        Math.round(
          seededNumber(seed + 10, -2, 3),
        ),
      humidity: Math.round(
        seededNumber(seed + 20, 45, 85),
      ),
      wind: Number(
        seededNumber(seed + 30, 5, 22).toFixed(
          1,
        ),
      ),
      visibility: Math.round(
        seededNumber(
          seed + 40,
          5000,
          15000,
        ),
      ),
      pressure: Math.round(
        seededNumber(
          seed + 50,
          1005,
          1025,
        ),
      ),
      description:
        weatherDescriptions[
          currentCondition
        ],
      icon: currentCondition,
    },
    hourly,
    daily,
    sunrise: '06:15 AM',
    sunset: '06:45 PM',
    updatedAt: new Date().toISOString(),
  };
}

const weatherCache: Record<
  string,
  CityWeather
> = {};

cities.forEach(city => {
  weatherCache[city.name] =
    generateDemoWeather(
      city.name,
      city.country,
    );
});

function getCity(name: string) {
  return cities.find(
    city =>
      city.name.toLowerCase() ===
      name.toLowerCase(),
  );
}

function formatDay(dateString: string) {
  return new Date(
    dateString,
  ).toLocaleDateString('en-US', {
    weekday: 'short',
  });
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently updated';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function readStringArray(key: string) {
  try {
    const stored =
      localStorage.getItem(key);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter(
          item => typeof item === 'string',
        )
      : [];
  } catch {
    return [];
  }
}

export default function WeatherPage() {
  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedCity, setSelectedCity] =
    useState<string | null>(null);

  const [favorites, setFavorites] =
    useState<string[]>([]);

  const [recentCities, setRecentCities] =
    useState<string[]>([]);

  const [showFavorites, setShowFavorites] =
    useState(false);

  const [showSearch, setShowSearch] =
    useState(false);

  const [searchError, setSearchError] =
    useState<string | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    const storedFavorites =
      readStringArray(FAVORITES_KEY);

    const storedRecent =
      readStringArray(RECENT_KEY);

    setFavorites(storedFavorites);
    setRecentCities(storedRecent);
    setHydrated(true);

    if (storedRecent.length > 0) {
      setSelectedCity(storedRecent[0]);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites),
    );
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(recentCities),
    );
  }, [recentCities, hydrated]);

  const selectedWeather = selectedCity
    ? weatherCache[selectedCity] ?? null
    : null;

  const searchResults = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) return [];

    return cities
      .filter(city => {
        return (
          city.name
            .toLowerCase()
            .includes(query) ||
          city.country
            .toLowerCase()
            .includes(query)
        );
      })
      .slice(0, 8);
  }, [searchQuery]);

  const favoriteCities = favorites
    .map(getCity)
    .filter(Boolean) as City[];

  const addRecentCity = (cityName: string) => {
    setRecentCities(previous => {
      const withoutCity =
        previous.filter(
          city => city !== cityName,
        );

      return [
        cityName,
        ...withoutCity,
      ].slice(0, 5);
    });
  };

  const selectCity = (cityName: string) => {
    if (!weatherCache[cityName]) {
      setSearchError(
        'City not available in demo data.',
      );
      return;
    }

    setSelectedCity(cityName);
    setSearchQuery('');
    setSearchError(null);
    setShowSearch(false);
    addRecentCity(cityName);
  };

  const toggleFavorite = (
    cityName: string,
  ) => {
    setFavorites(previous => {
      if (previous.includes(cityName)) {
        return previous.filter(
          city => city !== cityName,
        );
      }

      return [
        ...previous,
        cityName,
      ].slice(0, 10);
    });
  };

  const clearRecent = () => {
    setRecentCities([]);
  };

  const handleSearchSubmit = () => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) return;

    const exactMatch = cities.find(
      city =>
        city.name.toLowerCase() ===
        query,
    );

    const partialMatch =
      cities.find(city =>
        city.name
          .toLowerCase()
          .includes(query),
      );

    const match =
      exactMatch ?? partialMatch;

    if (!match) {
      setSearchError(
        'City not found. Try another city.',
      );
      return;
    }

    selectCity(match.name);
  };

  if (!selectedWeather) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold">
              Weather
            </h1>

            <p className="text-sm text-muted-foreground">
              Check weather for any supported
              city
            </p>
          </div>

          <Badge variant="outline">
            Demo Mode
          </Badge>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CloudSun size={34} />
              </div>

              <h2 className="text-xl font-semibold">
                Where do you want to check?
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Search a city to view its
                weather dashboard.
              </p>
            </div>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                autoFocus
                placeholder="Search city..."
                value={searchQuery}
                onChange={event => {
                  setSearchQuery(
                    event.target.value,
                  );
                  setSearchError(null);
                }}
                onKeyDown={event => {
                  if (
                    event.key === 'Enter'
                  ) {
                    handleSearchSubmit();
                  }
                }}
                className="pl-10 pr-10 h-12 text-base"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery('')
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 border border-border rounded-xl overflow-hidden bg-background shadow-lg">
                {searchResults.map(city => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() =>
                      selectCity(
                        city.name,
                      )
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <MapPin
                      size={15}
                      className="text-muted-foreground"
                    />

                    <span className="text-sm font-medium">
                      {city.name}
                    </span>

                    <span className="text-xs text-muted-foreground ml-auto">
                      {city.country}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {searchError && (
              <p className="text-sm text-red-500 mt-2">
                {searchError}
              </p>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  Favorite Cities
                </h3>

                {favorites.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {favorites.length}/10
                  </span>
                )}
              </div>

              {favoriteCities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {favoriteCities.map(city => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() =>
                        selectCity(
                          city.name,
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                    >
                      <Star
                        size={12}
                        className="fill-current"
                      />
                      {city.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Save cities from their weather
                  page to see them here.
                </p>
              )}
            </div>

            {recentCities.length > 0 && (
              <div className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">
                    Recent Searches
                  </h3>

                  <button
                    type="button"
                    onClick={clearRecent}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentCities.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() =>
                        selectCity(city)
                      }
                      className="px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-muted-foreground text-center mt-8">
              Demo weather is deterministic and
              stable between refreshes. Connect a
              weather API later for live data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const weather = selectedWeather;

  const WeatherIcon =
    weatherIcons[weather.current.icon] ??
    Cloud;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCity(null);
              setSearchQuery('');
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Back to city search"
          >
            <Search size={16} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">
              Weather
            </h1>

            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin size={12} />
              {weather.city}, {weather.country}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={
              favorites.includes(
                weather.city,
              )
                ? 'default'
                : 'outline'
            }
            size="sm"
            onClick={() =>
              toggleFavorite(
                weather.city,
              )
            }
          >
            <Star
              size={14}
              className={
                favorites.includes(
                  weather.city,
                )
                  ? 'fill-current'
                  : ''
              }
            />

            {favorites.includes(
              weather.city,
            )
              ? 'Saved'
              : 'Save'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setShowSearch(
                previous => !previous,
              )
            }
          >
            <Search size={14} />
            Search
          </Button>
        </div>
      </div>

      {showSearch && (
        <div className="py-4">
          <div className="relative max-w-xl">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              autoFocus
              placeholder="Search another city..."
              value={searchQuery}
              onChange={event => {
                setSearchQuery(
                  event.target.value,
                );
                setSearchError(null);
              }}
              onKeyDown={event => {
                if (
                  event.key === 'Enter'
                ) {
                  handleSearchSubmit();
                }
              }}
              className="pl-9"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 max-w-xl border border-border rounded-xl overflow-hidden bg-background shadow-lg">
              {searchResults.map(city => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() =>
                    selectCity(city.name)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50"
                >
                  <MapPin
                    size={14}
                    className="text-muted-foreground"
                  />

                  <span className="text-sm font-medium">
                    {city.name}
                  </span>

                  <span className="ml-auto text-xs text-muted-foreground">
                    {city.country}
                  </span>
                </button>
              ))}
            </div>
          )}

          {searchError && (
            <p className="text-sm text-red-500 mt-2">
              {searchError}
            </p>
          )}
        </div>
      )}

      {/* Dashboard */}
      <div className="grid lg:grid-cols-3 gap-6 pt-5">
        {/* Current weather */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-7">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <WeatherIcon size={46} />
                  </div>

                  <div>
                    <p className="text-5xl font-bold tracking-tight">
                      {weather.current.temp}°C
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      {
                        weather.current
                          .description
                      }
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      Updated{' '}
                      {formatUpdatedAt(
                        weather.updatedAt,
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Feels Like
                    </p>

                    <p className="text-lg font-semibold">
                      {
                        weather.current
                          .feelsLike
                      }
                      °C
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Droplet
                        size={12}
                        className="text-blue-500"
                      />
                      Humidity
                    </p>

                    <p className="text-lg font-semibold">
                      {
                        weather.current
                          .humidity
                      }
                      %
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Wind
                        size={12}
                        className="text-green-500"
                      />
                      Wind
                    </p>

                    <p className="text-lg font-semibold">
                      {weather.current.wind}{' '}
                      km/h
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Eye
                        size={12}
                        className="text-purple-500"
                      />
                      Visibility
                    </p>

                    <p className="text-lg font-semibold">
                      {(
                        weather.current
                          .visibility / 1000
                      ).toFixed(1)}{' '}
                      km
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Gauge
                        size={12}
                        className="text-orange-500"
                      />
                      Pressure
                    </p>

                    <p className="text-lg font-semibold">
                      {
                        weather.current
                          .pressure
                      }{' '}
                      hPa
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/50 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                        <Sunrise
                          size={12}
                          className="text-yellow-500"
                        />
                        Sunrise
                      </p>

                      <p className="text-sm font-semibold">
                        {weather.sunrise ??
                          '--'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                        <Sunset
                          size={12}
                          className="text-orange-500"
                        />
                        Sunset
                      </p>

                      <p className="text-sm font-semibold">
                        {weather.sunset ??
                          '--'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly */}
              <div className="w-full xl:w-80">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">
                    Hourly Forecast
                  </p>

                  <span className="text-[10px] text-muted-foreground">
                    Next 12 hours
                  </span>
                </div>

                <div className="space-y-1 max-h-[270px] overflow-y-auto pr-1">
                  {weather.hourly.map(
                    (hour, index) => {
                      const Icon =
                        weatherIcons[
                          hour.icon
                        ] ?? Cloud;

                      return (
                        <div
                          key={`${hour.time}-${index}`}
                          className={cn(
                            'flex items-center gap-3 p-2 rounded-lg',
                            index === 0 &&
                              'bg-primary/10',
                          )}
                        >
                          <span className="text-xs text-muted-foreground w-11">
                            {hour.time}
                          </span>

                          <Icon
                            size={16}
                            className="text-primary"
                          />

                          <span className="text-sm font-semibold w-9 text-right">
                            {hour.temp}°
                          </span>

                          {hour.precipitation >
                            0 && (
                            <span className="text-[10px] text-blue-500 ml-auto">
                              {
                                hour.precipitation
                              }
                              %
                            </span>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                7-Day Forecast
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {weather.daily.map(
                  (day, index) => {
                    const Icon =
                      weatherIcons[
                        day.icon
                      ] ?? Cloud;

                    return (
                      <div
                        key={`${day.date}-${index}`}
                        className="flex items-center gap-2 p-3 hover:bg-muted/30 transition-colors"
                      >
                        <span className="text-xs font-medium text-muted-foreground w-10">
                          {index === 0
                            ? 'Today'
                            : formatDay(
                                day.date,
                              )}
                        </span>

                        <Icon
                          size={16}
                          className="text-primary"
                        />

                        <span className="text-sm font-semibold ml-auto">
                          {day.tempMax}°
                        </span>

                        <span className="text-sm text-muted-foreground">
                          {day.tempMin}°
                        </span>

                        <span className="text-[10px] text-muted-foreground truncate w-20 hidden sm:block">
                          {
                            day.description
                          }
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Recent Searches
                </CardTitle>

                {recentCities.length >
                  0 && (
                  <button
                    type="button"
                    onClick={clearRecent}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {recentCities.length ===
              0 ? (
                <p className="text-xs text-muted-foreground">
                  No recent searches.
                </p>
              ) : (
                <div className="space-y-1">
                  {recentCities.map(
                    city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() =>
                          selectCity(
                            city,
                          )
                        }
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <MapPin
                          size={12}
                          className="text-muted-foreground"
                        />

                        <span className="text-sm">
                          {city}
                        </span>

                        <Star
                          size={11}
                          className={cn(
                            'ml-auto',
                            favorites.includes(
                              city,
                            )
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted-foreground',
                          )}
                        />
                      </button>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CloudSun
                  size={18}
                  className="text-primary mt-0.5"
                />

                <div>
                  <p className="text-sm font-medium">
                    Demo weather
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Current data is simulated
                    locally. It remains stable
                    between refreshes so the UI
                    does not show random weather.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}