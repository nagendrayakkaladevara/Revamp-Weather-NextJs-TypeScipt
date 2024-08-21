'use client';
import { CardSpotlightDemo } from "@/components/CardSpotlightDemo";
import { HeroHighlightDemo } from "@/components/hero";
import { MultiStepLoaderDemo } from "@/components/myloader";
import { Spotlight } from "@/components/Spotlight";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWeather, setShowWeather] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<any>([])

  const handleButtonClick = () => {
    setLoading(true);
    getLocation();
    setTimeout(() => {
      setLoading(false);
    }, 9000);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Failed to retrieve location. Please ensure location services are enabled.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              backgroundColor: 'black',
              color: 'white',
            },
          });
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: 'black',
          color: 'white',
        },
      });
      setLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY_googleapis;
    if (!apiKey) {
      console.error('Google API key is missing');
      setLoading(false);
      return;
    }

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to reverse GeoCode location');

      const data = await response.json();
      setLocationData(data);
      const city = extractCityFromGeocoderResult(data.results[0]);
      if (city) {
        setSelectedCity(city);
        fetchWeather(city);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // setTimeout(() => {
      //   toast.error('Error reverse geocoding');
      // }, 9000);
      setLoading(false);
    }
  };

  const extractCityFromGeocoderResult = (geocoderResult: any) => {
    const cityComponent = geocoderResult.address_components?.find((component: any) =>
      component.types.includes('locality')
    );
    return cityComponent?.long_name || 'Unknown';
  };

  const fetchWeather = async (city: string) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY_openweathermap;
    if (!apiKey) {
      console.error('OpenWeatherMap API key is missing');
      toast.error('OpenWeatherMap API key is missing.');
      setLoading(false);
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch weather data');

      const weatherData = await response.json();
      setWeather(weatherData);

      // Wait for either 9 seconds or until fetching is done, whichever is longer
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 8000)), // 9-second delay
        response.ok ? Promise.resolve() : Promise.reject('Error fetching weather data'),
      ]);

      setShowWeather(true);

    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Error fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen w-full rounded-md flex justify-center md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        {showWeather ? (<>
          <div className="flex flex-col items-center justify-center">
            <CardSpotlightDemo weather={weather} locationData={locationData} />
          </div>
        </>) : (<>
          <div className="flex flex-col items-center justify-center">
            <HeroHighlightDemo />
            <MultiStepLoaderDemo loading={loading} handleButtonClick={handleButtonClick} selectedCity={selectedCity} />
          </div>
        </>)}

        <ToastContainer />
      </div>
    </>
  );
}
