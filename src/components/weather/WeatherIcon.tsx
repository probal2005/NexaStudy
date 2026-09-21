import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Moon,
  Sun,
  Wind,
  type LucideIcon,
} from 'lucide-react';

export type WeatherCondition =
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

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

const icons: Record<WeatherCondition, LucideIcon> = {
  sunny: Sun,
  'partly-cloudy': Cloud,
  cloudy: Cloud,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  storm: CloudLightning,
  snow: CloudSnow,
  fog: CloudFog,
  windy: Wind,
  'clear-night': Moon,
};

export function WeatherIcon({
  condition,
  size = 32,
  className,
}: WeatherIconProps) {
  const Icon = icons[condition] ?? Cloud;

  return (
    <Icon
      size={size}
      className={className}
      aria-hidden="true"
    />
  );
}