'use client';
import { DirectionAwareHoverDemo } from "@/components/card";
import { Spotlight } from "@/components/Spotlight";
import { useEffect, useState } from "react";

export default function Home() {

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  console.log("🚀 ~ Home ~ weather:", weather)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            reverseGeocode(latitude, longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Failed to retrieve location. Please ensure location services are enabled.');
          }
        );
      } else {
        console.log('Geolocation is not supported by your browser');
      }
    };

    const reverseGeocode = async (latitude: number, longitude: number) => {

      const apiKey = process.env.NEXT_PUBLIC_API_KEY_googleapis;
      if (!apiKey) {
        console.error('Google API key is missing');
        return;
      }

      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to reverse GeoCode location');

        const data = await response.json();
        const city = extractCityFromGeocoderResult(data.results[0]);
        if (city) setSelectedCity(city);
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }

    };

    const extractCityFromGeocoderResult = (geocoderResult: any) => {
      const cityComponent = geocoderResult.address_components?.find((component: any) =>
        component.types.includes('locality')
      );
      return cityComponent?.long_name || 'Unknown';
    };

    getLocation();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;

      const apiKey = process.env.NEXT_PUBLIC_API_KEY_openweathermap;
      if (!apiKey) {
        console.error('OpenWeatherMap API key is missing');
        return;
      }

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const weatherData = await response.json();
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  return (
    <>
      <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <DirectionAwareHoverDemo data={weather} />
      </div>
    </>
  );
}
