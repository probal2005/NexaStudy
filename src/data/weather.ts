export type WeatherConditionData =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'drizzle'
  | 'storm'
  | 'snow'
  | 'fog'
  | 'windy'
  | 'clear-night';

export interface WeatherLocationData {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeatherData {
  location: WeatherLocationData;
  condition: WeatherConditionData;
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  high: number;
  low: number;
  sunrise: string;
  sunset: string;
  updatedAt: string;
}

export interface HourlyWeatherData {
  time: string;
  temperature: number;
  condition: WeatherConditionData;
  precipitationChance: number;
}

export interface DailyWeatherData {
  date: string;
  condition: WeatherConditionData;
  high: number;
  low: number;
  precipitationChance: number;
}

export const weatherLocations: WeatherLocationData[] = [
  {
    id: 'city-001',
    city: 'Chandigarh',
    country: 'India',
    countryCode: 'IN',
    latitude: 30.7333,
    longitude: 76.7794,
  },
  {
    id: 'city-002',
    city: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    latitude: 28.6139,
    longitude: 77.209,
  },
  {
    id: 'city-003',
    city: 'Kolkata',
    country: 'India',
    countryCode: 'IN',
    latitude: 22.5726,
    longitude: 88.3639,
  },
];

export const currentWeather: CurrentWeatherData = {
  location: weatherLocations[0],
  condition: 'partly-cloudy',
  description: 'Partly cloudy',
  temperature: 29,
  feelsLike: 31,
  humidity: 68,
  windSpeed: 12,
  visibility: 8,
  pressure: 1008,
  high: 32,
  low: 25,
  sunrise: '06:05',
  sunset: '18:18',
  updatedAt: '2026-09-21T18:00:00',
};

export const hourlyWeather: HourlyWeatherData[] = [
  {
    time: '19:00',
    temperature: 28,
    condition: 'partly-cloudy',
    precipitationChance: 20,
  },
  {
    time: '20:00',
    temperature: 27,
    condition: 'cloudy',
    precipitationChance: 25,
  },
  {
    time: '21:00',
    temperature: 27,
    condition: 'cloudy',
    precipitationChance: 30,
  },
  {
    time: '22:00',
    temperature: 26,
    condition: 'rain',
    precipitationChance: 45,
  },
  {
    time: '23:00',
    temperature: 26,
    condition: 'rain',
    precipitationChance: 50,
  },
];

export const dailyWeather: DailyWeatherData[] = [
  {
    date: '2026-09-21',
    condition: 'partly-cloudy',
    high: 32,
    low: 25,
    precipitationChance: 30,
  },
  {
    date: '2026-09-22',
    condition: 'rain',
    high: 31,
    low: 24,
    precipitationChance: 60,
  },
  {
    date: '2026-09-23',
    condition: 'cloudy',
    high: 30,
    low: 24,
    precipitationChance: 40,
  },
  {
    date: '2026-09-24',
    condition: 'sunny',
    high: 33,
    low: 25,
    precipitationChance: 15,
  },
];