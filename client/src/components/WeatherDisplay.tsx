
interface WeatherDisplayProps {
  weatherData: any;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  if (!weatherData?.weatherData?.list) return null;

  const dailyForecast = weatherData.weatherData.list
    .filter((item: any) => item.dt_txt.includes('12:00:00'))
    .slice(0, 5);

  const location = weatherData.weatherData.city?.coord
    ? `${weatherData.weatherData.city.coord.lat},${weatherData.weatherData.city.coord.lon}`
    : weatherData.location;

  return (
    <div className="space-y-6 mt-6">
      {/* Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyForecast.map((day: any) => (
          <div
            key={day.dt}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
