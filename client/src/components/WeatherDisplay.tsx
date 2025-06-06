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
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dailyForecast.map((day: any) => (
          <div key={day.dt} className="border p-4 rounded text-center">
            <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="mx-auto"
            />
            <p>{Math.round(day.main.temp - 273.15)}°C</p>
            <p>{day.weather[0].description}</p>
          </div>
        ))}
      </div>
      {location && (
        <div className="mt-4">
          <iframe
            width="100%"
            height="300"
            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${location}`}
            allowFullScreen
            className="border rounded"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;