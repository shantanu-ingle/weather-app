import { useEffect, useState } from 'react';
import axios from 'axios';
import ExportData from '../components/ExportData';

interface WeatherData {
  _id: string;
  location: string;
  dateRange: { start: string; end: string };
  weatherData: any;
}

const History: React.FC = () => {
  const [weatherRecords, setWeatherRecords] = useState<WeatherData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState<string>('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/weather');
      setWeatherRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/weather/${id}`, {
        location: editLocation,
      });
      setEditingId(null);
      fetchRecords();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/weather/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Weather History</h2>
      <ExportData />
      <div className="mt-4 space-y-4">
        {weatherRecords.map((record) => (
          <div key={record._id} className="border p-4 rounded">
            {editingId === record._id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="border p-2 w-full rounded"
                />
                <button
                  onClick={() => handleEdit(record._id)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p>Location: {record.location}</p>
                <p>
                  Date Range: {new Date(record.dateRange.start).toLocaleDateString()} -{' '}
                  {new Date(record.dateRange.end).toLocaleDateString()}
                </p>
                <button
                  onClick={() => {
                    setEditingId(record._id);
                    setEditLocation(record.location);
                  }}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;