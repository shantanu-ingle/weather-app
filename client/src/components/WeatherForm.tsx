import { useState } from 'react';
import axios from 'axios';

interface WeatherFormProps {
  onWeatherData: (data: any) => void;
}

const WeatherForm: React.FC<WeatherFormProps> = ({ onWeatherData }) => {
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.post('http://localhost:5000/api/weather', {
              location: `${latitude},${longitude}`,
              startDate,
              endDate,
            });
            onWeatherData(response.data);
          } catch (error) {
            console.error('Error fetching geolocation weather:', error);
          }
        },
        (error) => console.error('Geolocation error:', error)
      );
    } else {
      console.error('Geolocation not supported');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/weather', {
        location,
        startDate,
        endDate,
      });
      onWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location or use geolocation"
        className="border p-2 w-full rounded"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Get Weather
        </button>
        <button
          type="button"
          onClick={handleGeolocation}
          className="bg-green-500 text-white p-2 rounded"
        >
          Use Current Location
        </button>
      </div>
    </form>
  );
};

export default WeatherForm;