import { useState } from 'react';
import { Link } from 'react-router-dom';
import WeatherForm from '../components/WeatherForm';
import WeatherDisplay from '../components/WeatherDisplay';

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);

  const handleWeatherData = (data: any) => {
    setWeatherData(data);
    console.log('Weather data:', data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Weather App by [Your Name]</h1>
      <div className="flex space-x-4 mt-2">
        <a
          href="https://www.linkedin.com/company/pm-accelerator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-blue-500 text-white p-2 rounded">
            About PM Accelerator
          </button>
        </a>
        <Link to="/history">
          <button className="bg-purple-500 text-white p-2 rounded">
            View History
          </button>
        </Link>
      </div>
      <WeatherForm onWeatherData={handleWeatherData} />
      <WeatherDisplay weatherData={weatherData} />
    </div>
  );
};

export default Home;