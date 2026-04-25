import * as Location from "expo-location";
import { generateEnergySavingAdvice } from "./GeminiService";

type ApplianceItem = {
  name?: string;
  quantity?: number;
};

export type WeatherSnapshot = {
  city: string;
  temperatureC: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  source: "gps" | "profile";
};

type AdviceRequest = {
  profileLocation?: string;
  appliances?: Record<string, ApplianceItem>;
  tariffSummary?: string;
  unitsSummary?: string;
};

type AdviceResult = {
  weather: WeatherSnapshot;
  advice: string;
};

const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || "";

const ensureWeatherKey = () => {
  if (!OPEN_WEATHER_KEY) {
    throw new Error("OpenWeather key is missing. Add EXPO_PUBLIC_OPENWEATHER_API_KEY to your .env file.");
  }
};

const toAppliancesSummary = (appliances: Record<string, ApplianceItem> | undefined) => {
  if (!appliances) {
    return "No appliances listed.";
  }

  const values = Object.values(appliances).filter((item) => item && item.name);
  if (!values.length) {
    return "No appliances listed.";
  }

  return values
    .map((item) => `${item.name} x${Math.max(1, Number(item.quantity || 1))}`)
    .join(", ");
};

const mapWeatherResponse = (data: any, source: "gps" | "profile"): WeatherSnapshot => ({
  city: data?.name || "Unknown",
  temperatureC: Number(data?.main?.temp || 0),
  condition: data?.weather?.[0]?.description || "Unknown",
  humidity: Number(data?.main?.humidity || 0),
  windSpeed: Number(data?.wind?.speed || 0),
  source,
});

const fetchWeatherByCoords = async (lat: number, lon: number) => {
  ensureWeatherKey();
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.text();
    console.error("OpenWeather API Error (Coords):", errorData);
    throw new Error(`OpenWeather API failed: ${response.status}`);
  }

  const data = await response.json();
  return mapWeatherResponse(data, "gps");
};

const buildLocationQueries = (locationName: string) => {
  const trimmed = locationName.trim();
  if (!trimmed) {
    return ["Karachi,PK"];
  }

  const hasComma = trimmed.includes(",");
  const queries = [
    trimmed,
    hasComma ? `${trimmed},PK` : `${trimmed}, Karachi, PK`,
    hasComma ? trimmed : `${trimmed}, Pakistan`,
    "Karachi,PK",
  ];

  return Array.from(new Set(queries));
};

const fetchWeatherByLocationName = async (locationName: string) => {
  ensureWeatherKey();

  let lastErrorMsg = "";
  const queries = buildLocationQueries(locationName);
  
  for (const query of queries) {
    const encoded = encodeURIComponent(query);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&appid=${OPEN_WEATHER_KEY}&units=metric`;
    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        return mapWeatherResponse(data, "profile");
      } else {
        const errText = await response.text();
        lastErrorMsg = `Status ${response.status}: ${errText}`;
        console.warn(`Weather query failed for "${query}":`, lastErrorMsg);
      }
    } catch (e: any) {
      lastErrorMsg = e.message;
    }
  }

  throw new Error(`Unable to fetch weather for "${locationName}". Last error: ${lastErrorMsg}`);
};

const resolveCurrentWeather = async (profileLocation?: string) => {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status === "granted") {
      // First try to get the last known position to avoid hanging on Android
      let current = await Location.getLastKnownPositionAsync();
      
      // If none is known, request a fresh one with low accuracy to make it fast
      if (!current) {
        current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      }
      
      if (current) {
        return await fetchWeatherByCoords(current.coords.latitude, current.coords.longitude);
      }
    }
  } catch (error) {
    console.warn("GPS weather lookup failed, falling back to location name:", error);
  }

  if (profileLocation?.trim()) {
    try {
      return await fetchWeatherByLocationName(profileLocation.trim());
    } catch (fallbackError) {
      console.warn("Fallback weather lookup failed:", fallbackError);
    }
  }

  // Return mock weather so the AI Advice API can still be tested while waiting for the API key to activate
  console.warn("Returning mock weather because all live fetches failed.");
  return {
    city: profileLocation?.trim() || "Karachi",
    temperatureC: 32,
    condition: "Sunny (Mock Data)",
    humidity: 60,
    windSpeed: 3,
    source: "profile",
  };
};

const toWeatherSummary = (weather: WeatherSnapshot) =>
  `${weather.city}: ${weather.temperatureC}°C, ${weather.condition}, humidity ${weather.humidity}%, wind ${weather.windSpeed} m/s`;

export const getWeatherAndAiAdvice = async (request: AdviceRequest): Promise<AdviceResult> => {
  const weather = await resolveCurrentWeather(request.profileLocation);
  const appliancesSummary = toAppliancesSummary(request.appliances);

  const advice = await generateEnergySavingAdvice({
    locationLabel: request.profileLocation?.trim() || weather.city,
    weatherSummary: toWeatherSummary(weather),
    appliancesSummary,
    tariffSummary: request.tariffSummary,
    unitsSummary: request.unitsSummary,
  });

  return { weather, advice };
};
