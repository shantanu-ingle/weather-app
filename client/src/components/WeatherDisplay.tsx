
import { useState } from 'react';
import {
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);

interface WeatherDisplayProps {
  weatherData: any;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  if (!weatherData?.weatherData?.list) return null;

  const dailyForecast = weatherData.weatherData.list
    .filter((item: any) => item.dt_txt.includes('12:00:00'))
    .slice(0, 5);

  const location = weatherData.weatherData.city?.coord
    ? `${weatherData.weatherData.city.coord.lat},${weatherData.weatherData.city.coord.lon}`
    : weatherData.location;

  const cityData = weatherData.weatherData.city;

  const toggleExpand = (dt: string) => {
    setExpandedDay(expandedDay === dt ? null : dt);
  };

  // Get temperature data for the selected day
  const getDayData = (dt: number) => {
    const selectedDate = new Date(dt * 1000).toDateString();
    return weatherData.weatherData.list.filter((item: any) =>
      new Date(item.dt * 1000).toDateString() === selectedDate
    );
  };

  // Chart.js data and options
  const getChartData = (dayData: any[]) => ({
    labels: dayData.map((item: any) =>
      new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    ),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: dayData.map((item: any) => Math.round(item.main.temp - 273.15)),
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.4, // Smooth curve
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
        },
      },
      y: {
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#475569',
          callback: (value: number) => `${value}°C`,
        },
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#1e293b',
        },
      },
    },
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyForecast.map((day: any) => (
          <div
            key={day.dt}
            className={`bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
              expandedDay === day.dt ? 'scale-105 bg-blue-50/50' : ''
            }`}
            onClick={() => toggleExpand(day.dt)}
          >
            <p className="text-sm font-semibold text-slate-700">
              {new Date(day.dt * 1000).toLocaleDateString()}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="mx-auto my-2 w-12 h-12"
            />
            <p className="text-lg font-bold text-slate-900">
              {Math.round(day.main.temp - 273.15)}°C
            </p>
            <p className="text-sm capitalize text-slate-600">
              {day.weather[0].description}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded Details */}
      {expandedDay && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 mt-4 animate-fade-in">
          {dailyForecast
            .filter((day: any) => day.dt === parseInt(expandedDay))
            .map((day: any) => {
              const dayData = getDayData(day.dt);
              return (
                <div key={day.dt} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                      className="w-16 h-16"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h3>
                      <p className="text-lg capitalize text-slate-600">
                        {day.weather[0].description}
                      </p>
                    </div>
                  </div>

                  {/* Temperature Graph */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">
                      Temperature Trend
                    </h4>
                    <div className="h-64">
                      <Line data={getChartData(dayData)} options={chartOptions} />
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Temperature:</span>{' '}
                        {Math.round(day.main.temp - 273.15)}°C
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Feels Like:</span>{' '}
                        {Math.round(day.main.feels_like - 273.15)}°C
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Humidity:</span> {day.main.humidity}%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Wind Speed:</span> {day.wind.speed} m/s
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Pressure:</span> {day.main.pressure} hPa
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Visibility:</span>{' '}
                        {day.visibility / 1000} km
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Cloud Cover:</span> {day.clouds.all}%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Precipitation:</span>{' '}
                        {(day.pop * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h3m15 0h-3M7 3v3m10 0v-3m-2 14h2a2 2 0 002-2v-3m-16 5h-2a2 2 0 01-2-2v-3m4-10H3a2 2 0 00-2 2v3m16-3h2a2 2 0 012 2v3M12 9a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Sunrise:</span>{' '}
                        {new Date(cityData.sunrise * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h3m15 0h-3M7 3v3m10 0v-3m-2 14h2a2 2 0 002-2v-3m-16 5h-2a2 2 0 01-2-2v-3m4-10H3a2 2 0 00-2 2v3m16-3h2a2 2 0 012 2v3M12 9a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Sunset:</span>{' '}
                        {new Date(cityData.sunset * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedDay(null)}
                    className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close
                  </button>
                </div>
              );
            })}
        </div>
      )}

      {/* Google Maps */}
      {location && (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Location Map</h3>
          <iframe
            width="100%"
            height="300"
            src={`https://www.google.com/maps/embed/v1/place?key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }&q=${location}`}
            allowFullScreen
            className="border rounded-lg"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
