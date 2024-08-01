// import React, { useEffect, useState } from 'react';
// import { Container, Title, WeatherInfo, Temperature, AdditionalInfo, InfoItem } from './App.styled.js';

// // Helper function to map symbol codes to descriptions
// const getDescription = (symbolCode) => {
//   const descriptions = {
//     "clearsky_day": "Clear sky",
//     "clearsky_night": "Clear sky (night)",
//     "lightrainshowers_day": "Light rain showers",
//     "lightrainshowersandthunder_day": "Light rain showers and thunder",
//     // Add more mappings as needed
//   };

//   return descriptions[symbolCode] || "Unknown weather condition";
// };

// // Main App component
// function App() {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchWeather = (lat, lon) => {
//       const userAgent = process.env.REACT_APP_USER_AGENT;

//       fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
//         headers: {
//           'User-Agent': userAgent
//         }
//       })
//         .then(response => response.json())
//         .then(data => {
//           const timeseries = data.properties.timeseries[0];
//           const currentWeather = timeseries.data.instant.details;
//           const nextHourWeather = timeseries.data.next_1_hours;

//           setWeather({
//             temperature: currentWeather.air_temperature,
//             windSpeed: currentWeather.wind_speed,
//             humidity: currentWeather.relative_humidity,
//             precipitation: nextHourWeather.details.precipitation_amount,
//             description: getDescription(nextHourWeather.summary.symbol_code)
//           });
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching weather data:', error);
//           setError('Failed to fetch weather data');
//           setLoading(false);
//         });
//     };

//     const getLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           position => {
//             const { latitude, longitude } = position.coords;
//             fetchWeather(latitude, longitude);
//           },
//           error => {
//             console.error('Error getting location:', error);
//             setError('Failed to get location');
//             setLoading(false);
//           }
//         );
//       } else {
//         console.error('Geolocation is not supported by this browser.');
//         setError('Geolocation is not supported by this browser');
//         setLoading(false);
//       }
//     };

//     getLocation();
//   }, []);

//   return (
//     <Container>
//       <Title>Прогноз погоди</Title>
//       {loading ? (
//         <p>Загрузка даних...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         weather && (
//           <WeatherInfo>
//             <Temperature>{Math.round(weather.temperature)}°C</Temperature>
//             <AdditionalInfo>
//               <InfoItem>Місто: {weather.location}</InfoItem>
//               <InfoItem>Швидкість вітру: {weather.windSpeed} m/s</InfoItem>
//               <InfoItem>Вологість: {weather.humidity}%</InfoItem>
//               <InfoItem>Опади: {weather.precipitation} mm</InfoItem>
//             </AdditionalInfo>
//           </WeatherInfo>
//         )
//       )}
//     </Container>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Container, Title, WeatherInfo, Temperature, AdditionalInfo, InfoItem, Label } from './App.styled.js';

// Helper function to map symbol codes to descriptions
const getDescription = (symbolCode) => {
  const descriptions = {
    "clearsky_day": "Clear sky",
    "clearsky_night": "Clear sky (night)",
    "lightrainshowers_day": "Light rain showers",
    "lightrainshowersandthunder_day": "Light rain showers and thunder",
    // Add more mappings as needed
  };

  return descriptions[symbolCode] || "Unknown weather condition";
};

// Main App component
function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const fetchWeather = (lat, lon) => {
    const userAgent = process.env.REACT_APP_USER_AGENT;

    fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
      headers: {
        'User-Agent': userAgent
      }
    })
      .then(response => response.json())
      .then(data => {
        const timeseries = data.properties.timeseries[0];
        const currentWeather = timeseries.data.instant.details;
        const nextHourWeather = timeseries.data.next_1_hours;

        setWeather({
          temperature: currentWeather.air_temperature,
          windSpeed: currentWeather.wind_speed,
          humidity: currentWeather.relative_humidity,
          precipitation: nextHourWeather.details.precipitation_amount,
          description: getDescription(nextHourWeather.summary.symbol_code)
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data');
        setLoading(false);
      });
  };

  const fetchCities = (query) => {
    const username = process.env.REACT_APP_GEONAMES_USERNAME;

    fetch(`http://api.geonames.org/searchJSON?q=${query}&maxRows=10&username=${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`GeoNames API error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        const cityOptions = data.geonames.map(city => ({
          label: city.name,
          value: { lat: city.lat, lon: city.lng }
        }));
        setCities(cityOptions);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
        setError('Failed to fetch cities');
      });
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setLoading(true);
    fetchWeather(selectedOption.value.lat, selectedOption.value.lon);
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          error => {
            console.error('Error getting location:', error);
            setError('Failed to get location');
            setLoading(false);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setError('Geolocation is not supported by this browser');
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <Container>
      <Title>Прогноз погоди</Title>
      <Label>
        Виберіть місто:
        <Select
          onInputChange={fetchCities}
          onChange={handleCityChange}
          options={cities}
          placeholder="Пошук міста"
          noOptionsMessage={() => "Місто не знайдено"}
        />
      </Label>
      {loading ? (
        <p>Загрузка даних...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        weather && (
          <WeatherInfo>
            <Temperature>{Math.round(weather.temperature)}°C</Temperature>
            <AdditionalInfo>
              <InfoItem>Місто: {selectedCity ? selectedCity.label : 'Автоматичне визначення'}</InfoItem>
              <InfoItem>Швидкість вітру: {weather.windSpeed} m/s</InfoItem>
              <InfoItem>Вологість: {weather.humidity}%</InfoItem>
              <InfoItem>Опади: {weather.precipitation} mm</InfoItem>
              <InfoItem>Опис: {weather.description}</InfoItem>
            </AdditionalInfo>
          </WeatherInfo>
        )
      )}
    </Container>
  );
}

export default App;
