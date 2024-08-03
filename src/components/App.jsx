import React, { useEffect, useState } from 'react';
import { Container, Title, WeatherInfo, Temperature, AdditionalInfo, InfoItem } from './App.styled.js';

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

  useEffect(() => {
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
      {loading ? (
        <p>Загрузка даних...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        weather && (
          <WeatherInfo>
            <Temperature>{Math.round(weather.temperature)}°C</Temperature>
            <AdditionalInfo>
              <InfoItem>Місто: {weather.location}</InfoItem>
              <InfoItem>Швидкість вітру: {weather.windSpeed} m/s</InfoItem>
              <InfoItem>Вологість: {weather.humidity}%</InfoItem>
              <InfoItem>Опади: {weather.precipitation} mm</InfoItem>
            </AdditionalInfo>
          </WeatherInfo>
        )
      )}
    </Container>
  );
}

export default App;