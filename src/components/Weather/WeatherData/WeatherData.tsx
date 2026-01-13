import { useEffect, useState } from "react";

import { getCityWeather } from "../../../api/api";
import styles from "./WeatherData.module.css";

type cityWeatherData = {
  location: {
    name: string;
    localtime: string;
  };

  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };

  forecast: {
    forecastday: Array<{
      date: string;

      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          icon: string;
        };
      };

      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          icon: string;
        };
      }>;
    }>;
  };
};

export const WeatherData = (props: { city: string }) => {
  const { city } = props;
  const [cityData, setCityData] = useState<cityWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!city) return;

    const getWeatherData = async () => {
      try {
        const weatherData = await getCityWeather(city);
        setLoading(true);

        if (weatherData) {
          setCityData(weatherData);
        }
      } catch (error) {
        console.error("Failed to load city:", error);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, [city]);

  if (loading) return <p>Loading...</p>;
  if (!cityData) return <p>City weather data not found.</p>;

  return (
    <div className={styles["container"]}>
      <div className={styles["weather"]}>
        <h3 className={styles["weather-title"]}>{cityData.location.name}</h3>
        <p>
          {`${new Date(cityData.location.localtime).toLocaleDateString(
            "ru-ru",
            {
              weekday: "short",
              day: "2-digit",
              month: "long",
            }
          )} ${new Date(cityData.location.localtime).toLocaleTimeString(
            "ru-ru",
            {
              timeStyle: "short",
            }
          )}`}
        </p>
        <p className={styles["deg"]}>
          {Math.round(cityData.current.temp_c)}&deg;
        </p>
        <p>Feels like {Math.round(cityData.current.feelslike_c)}&deg;</p>
        <p>{cityData.current.condition.text}</p>
        <img
          src={cityData.current.condition.icon}
          alt="icon"
          className={styles["weather-icon"]}
        />
      </div>
      <hr className={styles["line"]} />
      <div className={styles["hourly-container"]}>
        <h4>Hourly Weather</h4>
        <div className={styles["hourly"]}>
          {cityData.forecast.forecastday[0].hour.map((hourData) => (
            <div key={hourData.time}>
              <p>
                {new Date(hourData.time).toLocaleTimeString("ru-ru", {
                  hour: "numeric",
                })}
              </p>
              <img src={hourData.condition.icon} alt="icon" />
              <p>{Math.round(hourData.temp_c)}&deg;</p>
            </div>
          ))}
        </div>
      </div>
      <hr className={styles["line"]} />
      <div className={styles["forecast-container"]}>
        <h4 className={styles["forecast-title"]}>3 Day Forecast</h4>
        {cityData.forecast.forecastday.map((day) => (
          <div key={day.date} className={styles["forecast"]}>
            <p className={styles["day"]}>
              {new Date(day.date)
                .toLocaleDateString("ru-ru", {
                  weekday: "long",
                })
                .replace(/^./, (char) => char.toUpperCase())}
            </p>
            <img src={day.day.condition.icon} alt="icon" />
            <div className={styles["temp-container"]}>
              <p>Max: {Math.round(day.day.maxtemp_c)}&deg;</p>
              <p>Min: {Math.round(day.day.mintemp_c)}&deg;</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
