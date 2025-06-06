import { useState } from 'react';
import { Link } from 'react-router-dom';
import WeatherForm from '../components/WeatherForm';
import WeatherDisplay from '../components/WeatherDisplay';

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWeatherData = (data: any) => {
    setWeatherData(data);
    setIsLoading(false);
    console.log('Weather data:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent mb-3">
              🌤️ Weather App
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Get current weather information for any city worldwide
            </p>
            <div className="text-sm text-slate-500 mb-8">
              Built by <span className="font-semibold text-slate-700">Shantanu Ingle</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.linkedin.com/school/pmaccelerator/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                  About PM Accelerator
                </button>
              </a>
              
              <Link to="/history">
                <button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View History
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Weather Search Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                🔍 Search Weather
              </h2>
              <p className="text-slate-600">
                Enter a city name to get current weather conditions and temperature
              </p>
            </div>
            <WeatherForm onWeatherData={handleWeatherData} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                <span className="text-slate-700 font-semibold text-lg">Getting weather data...</span>
              </div>
            </div>
          )}

          {/* Weather Display */}
          {weatherData && !isLoading && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Weather in {weatherData.weatherData.city.name}
                </h3>
                <WeatherDisplay weatherData={weatherData} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!weatherData && !isLoading && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-16 text-center">
              <div className="text-6xl mb-6 opacity-80">🌍</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Ready to Check Weather?
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                Enter any city name above to see current weather conditions, temperature, and atmospheric details.
              </p>
              <div className="mt-6 flex justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  🌡️ Temperature
                </span>
                <span className="flex items-center gap-1">
                  💧 Humidity
                </span>
                <span className="flex items-center gap-1">
                  💨 Wind Speed
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/60 backdrop-blur-sm border-t border-slate-200/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-600 font-medium">
            Stay informed about weather conditions worldwide 🌤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;