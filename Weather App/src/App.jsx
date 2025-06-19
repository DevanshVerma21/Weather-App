import React, { useState, useEffect } from 'react';
import WeatherBackground from './components/WeatherBackground';
import { convertTemperature, getHumidityValue, getVisibilityValue, getWindDirection } from './components/helper';
import HumidityIcon from './assets/humidity.png';
import SunriseIcon from './assets/sunrise.png';
import SunsetIcon from './assets/sunset.png';
import VisibilityIcon from './assets/visibility.png';
import WindIcon from './assets/wind.png';
import HELPER from './components/helper';


const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggesstion, setSuggestion] = useState([]);
  const [swap, setSwap] = useState(false);
  const [fade, setFade] = useState(false);
  const [unit, setUnit] = useState('C');
  const [error, setError] = useState('');

const API_key = import.meta.env.VITE_WEATHER_API_KEY;


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setSwap((prev) => !prev);
        setFade(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestion(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchSuggestion = async (query) => {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_key}`
      );
      res.ok ? setSuggestion(await res.json()) : setSuggestion([]);
    } catch {
      setSuggestion([]);
    }
  };

  const getWeathercondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay: Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset,
    };

  const fetchWeatherData = async (url, name = '') => {
    setError('');
    setWeather(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error((await response.json()).message || 'City not Found');
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError('Please enter a valid city name.');
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
    );
    setCity(''); // Clear the search box
  };

  return (
    <div className='mih-h-screen'>
      <WeatherBackground
        condition={
          weather && {
            main: weather.weather[0].main,
            isDay: Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset,
          }
        }
      />

      <div className='flex items-center justify-center p-6 min-h-screen'>
        <div
          className='bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white
        w-full border border-white/10 relative z-10'
        >
          <h1 className='text-4xl font-extrabold text-center mb-6 flex items-center justify-center gap-2'>
            <span
              className={`transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
              aria-label='emoji-left'
            >
              {swap ? '☁️' : '☀️'}
            </span>
            <span>Weather App</span>
            <span
              className={`transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
              aria-label='emoji-right'
            >
              {swap ? '☀️' : '☁️'}
            </span>
          </h1>

          {!weather && (
            <form onSubmit={handleSearch} className='flex flex-col relative'>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='Enter City or Country'
                className='mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none
              focus:border-e-blue-300 transition duration-300'
              />
              <button
                type='submit'
                className='bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors'
              >
                Get Weather
              </button>
            </form>
          )}
          {weather && (
            <div className='mt-6 text-center transition-opacity duration-500'>
              <h2 className='text-2xl font-bold'>{city}</h2>
              <p>Temperature: {weather.main?.temp}°C</p>
              <p>Condition: {weather.weather?.[0]?.main}</p>
              <button
                onClick={() => {
                  setWeather(null);
                  setCity('');
                }}
                className='mt-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors'
              >
                New Search
              </button>

              <div className='flex justify-between items-center'>
                <h2 className='text-3xl font-bold'>{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
                  className='bg-blue-600 hover:bg-amber-300 text-white font-semibold py-1 px-3 rounded transition-colors'
                >
                  &deg;{unit}
                </button>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className='mx-auto my-4 animate'
              />
              <p className='text-4xl'>
                {convertTemperature(weather.main.temp, unit)} &deg;{unit}
              </p>
              <p className='capitalize'>{weather.weather[0].description}</p>
              <div className='flex flex-wrap justify-around mt-6'>
                {[
                  [HumidityIcon, 'Humidity', `${weather.main.humidity}% (${getHumidityValue(weather.main.humidity)})`],
                  [
                    WindIcon,
                    'Wind',
                    `${weather.wind.speed} m/s ${
                      weather.wind.deg ? `(${getWindDirection(weather.wind.deg)})` : ''
                    }`,
                  ],
                  [VisibilityIcon, 'Visibility', getVisibilityValue(weather.visibility)],
                ].map(([icon, label, value]) => (
                  <div key={label} className='flex flex-col items-center m-2'>
                    <img src={icon} alt={label} className='w-8 h-8' />
                    <p className='mt-1 font-semibold'>{label}</p>
                    <p className='text-sm'>{value}</p>
                  </div>
                ))}
              </div>

              <div className='flex flex-wrap justify-around mt-6'>
                {[
                  [SunriseIcon, 'Sunrise', weather.sys.sunrise],
                  [SunsetIcon, 'Sunset', weather.sys.sunset],
                ].map(([icon, label, time]) => (
                  <div key={label} className='flex flex-col items-center m-2'>
                    <img src={icon} alt={label} className='w-8 h-8' />
                    <p className='mt-1 font-semibold'>{label}</p>
                    <p className='text-sm'>
                      {new Date(time * 1000).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
              <div className='mt-6 text-sm'>
                <p>
                  <strong>Feels Like:</strong> {convertTemperature(weather.main.feels_like, unit)} &deg;{unit}
                </p>
                <p>
                  <strong>Pressure:</strong> {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          )}
          {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
