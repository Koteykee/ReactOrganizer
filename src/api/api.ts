import axios from "axios";

import { WEATHER_API, WEATHER_API_KEY } from "../config/config";
import type { SearchResults, CityWeatherData } from "../types/weather.type";

const Api = axios.create({ baseURL: `${WEATHER_API}` });

export const getWeather = async (
  searchQuery: string
): Promise<SearchResults[]> => {
  const { data } = await Api.get(
    `/search.json?key=${WEATHER_API_KEY}&q=${searchQuery}`
  );
  return data;
};

export const getCityWeather = async (
  city: string
): Promise<CityWeatherData> => {
  const { data } = await Api.get(
    `/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
  );
  return data;
};
