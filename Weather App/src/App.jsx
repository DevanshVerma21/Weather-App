import React from 'react'
import WeatherBackground from './components/WeatherBackground'

const App = () => {

  const [weather, setWeather] = React.useState(null);
  const [city,setCity] = React.useState('');
  const [suggesstion,setSuggestion] = useState([]);

  //e041930c17ff530b21543084db7ac880
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    //https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

  const getWeathercondition = () => weather && ({
    main: weather.weather[0].main,
    isDay : Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset
  })
  return (
    <div className='mih-h-screen'>
      <WeatherBackground condition={getWeathercondition()}/>

      <div className='flex items-center justify-center p-6 min-h-screen'>
        <div className='bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white
        w-full border border-white/10 relative z-10'>
          <h1 className='text-4xl font-extrabold text-center mb-6'>
            Weather App
          </h1>

          {weather ? (
            <form onSubmit={handleSearch} className='flex flex-col relative'>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter City or Country' 
              className='mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none
              focus:border-e-blue-300 transition duration-300'/>
              {suggesstion.length > 0 && (
                <div className='absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10'>
                  {suggesstion.map((s) => (
                    <button>

                    </button>
                  
                  ))}
              </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
