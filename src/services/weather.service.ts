import { getStorageItem, setStorageItem } from '@/lib/storage';
import type { CurrentWeatherData } from '@/data/weather';
import { currentWeather, weatherLocations } from '@/data/weather';

const FAVORITES_KEY = 'nexastudy_weather_favorites_v1';
const RECENT_KEY = 'nexastudy_weather_recent_v1';

export async function getWeather(
  city: string,
): Promise<CurrentWeatherData | null> {
  const normalized = city.trim().toLowerCase();
  if (!normalized) return null;

  const location = weatherLocations.find(
    (item) => item.city.toLowerCase() === normalized,
  );

  if (!location) return null;

  // The current demo dataset contains one detailed current-weather record.
  // For other configured cities, reuse the same demo measurements but attach
  // the requested location so the search remains functional until a real API
  // is connected.
  return {
    ...currentWeather,
    location,
  };
}

export async function getFavoriteCities(): Promise<string[]> {
  return getStorageItem<string[]>(FAVORITES_KEY, []);
}

export async function toggleFavoriteCity(city: string): Promise<string[]> {
  const normalized = city.trim();
  if (!normalized) return getFavoriteCities();

  const favorites = await getFavoriteCities();
  const exists = favorites.some(
    (item) => item.toLowerCase() === normalized.toLowerCase(),
  );

  const updated = exists
    ? favorites.filter(
        (item) => item.toLowerCase() !== normalized.toLowerCase(),
      )
    : [...favorites, normalized];

  setStorageItem(FAVORITES_KEY, updated);
  return updated;
}

export async function getRecentCities(): Promise<string[]> {
  return getStorageItem<string[]>(RECENT_KEY, []);
}

export async function addRecentCity(city: string): Promise<string[]> {
  const normalized = city.trim();
  if (!normalized) return getRecentCities();

  const recent = await getRecentCities();
  const updated = [
    normalized,
    ...recent.filter(
      (item) => item.toLowerCase() !== normalized.toLowerCase(),
    ),
  ].slice(0, 8);

  setStorageItem(RECENT_KEY, updated);
  return updated;
}
