import { useRef, useState, type ChangeEvent } from "react";

import { getWeather } from "../../../api/api";
import { WeatherData } from "../WeatherData/WeatherData";
import styles from "./WeatherSearch.module.css";

type searchResults = {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
};

export const WeatherSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<searchResults[] | null>(
    null
  );
  const [searchError, setSearchError] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");

  const queryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getSearchResults = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchError(false);

    if (queryTimeout.current) clearTimeout(queryTimeout.current);

    queryTimeout.current = setTimeout(async () => {
      if (value.trim() !== "") {
        try {
          const result = await getWeather(value);

          if (result) {
            setSearchResults(result);
            setSearchError(false);
          }
        } catch {
          setSearchError(true);
        }
        return;
      }
      setSearchResults(null);
    }, 300);
  };

  const getCity = (city: string) => {
    setCity(city);
    setSearchResults(null);
    setSearchQuery("");
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={getSearchResults}
        placeholder="Search for a city or state"
        className={styles["search-bar"]}
      />
      {searchResults && (
        <ul className={styles["city-container"]}>
          {searchError && (
            <p className={styles["error"]}>
              Sorry, something went wrong, please try again.
            </p>
          )}
          {!searchError && searchResults.length === 0 && (
            <p className={styles["error"]}>
              No results match your query, try a different term.
            </p>
          )}
          {!searchError && searchResults.length !== 0 && (
            <div>
              {searchResults.map((searchResult) => (
                <li
                  key={searchResult.id}
                  onClick={() => getCity(searchResult.name)}
                  className={styles["city"]}
                >
                  {searchResult.name}, {searchResult.country}
                </li>
              ))}
            </div>
          )}
        </ul>
      )}
      {city !== "" && (
        <div>
          <WeatherData city={city} />
        </div>
      )}
    </div>
  );
};
