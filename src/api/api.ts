import axios from "axios";

import { WEATHER_API, WEATHER_API_KEY } from "../config/config";

const Api = axios.create({ baseURL: `${WEATHER_API}` });

export const getWeather = async (searchQuery: string) => {
  const { data } = await Api.get(
    `/search.json?key=${WEATHER_API_KEY}&q=${searchQuery}`
  );
  return data;
};

export const getCityWeather = async (city: string) => {
  const { data } = await Api.get(
    `/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
  );
  return data;
};
