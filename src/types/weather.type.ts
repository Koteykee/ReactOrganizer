export interface SearchResults {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface CityWeatherData {
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
}
