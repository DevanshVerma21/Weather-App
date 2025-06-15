import React, { useState, useEffect } from 'react'
import WeatherBackground from './components/WeatherBackground'

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggesstion, setSuggestion] = useState([]);
  const [swap, setSwap] = useState(false);
  const [fade, setFade] = useState(false);

  const API_key = '041930c17ff530b21543084db7ac880';

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

  const getWeathercondition = () => weather && ({
    main: weather.weather[0].main,
    isDay: Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset
  });

  // Dummy fetchWeatherData function
  const fetchWeatherData = async (url, cityName) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
      setCity(cityName);
    } catch (err) {
      alert('Error fetching weather');
    }
  };

  // Handle form submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`,
      city
    );
  };

  return (
    <div className='mih-h-screen'>
      <WeatherBackground condition={weather && ({
        main: weather.weather[0].main,
        isDay: Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset
      })} />

      <div className='flex items-center justify-center p-6 min-h-screen'>
        <div className='bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white
        w-full border border-white/10 relative z-10'>
          <h1 className="text-4xl font-extrabold text-center mb-6 flex items-center justify-center gap-2">
            <span
              className={`transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
              aria-label="emoji-left"
            >
              {swap ? '☁️' : '☀️'}
            </span>
            <span>Weather App</span>
            <span
              className={`transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
              aria-label="emoji-right"
            >
              {swap ? '☀️' : '☁️'}
            </span>
          </h1>

          <form onSubmit={handleSearch} className='flex flex-col relative'>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='Enter City or Country'
              className='mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none
              focus:border-e-blue-300 transition duration-300'
            />
            {suggesstion.length > 0 && (
              <div className='absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10'>
                {suggesstion.map((s) => (
                  <button
                    type='button'
                    key={`${s.lat}-${s.lon}`}
                    onClick={() =>
                      fetchWeatherData(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_key}&units=metric`,
                        `${s.name}, ${s.country}${s.state ? `,${s.state}` : ''}`
                      )
                    }
                    className='block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors'
                  >
                    {s.name},{s.country}{s.state && `, ${s.state}`}
                  </button>
                ))}
              </div>
            )}
            <button
              type='submit'
              className='bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors'
            >
              Get Weather
            </button>
          </form>

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
