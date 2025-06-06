import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ExportData from '../components/ExportData';

interface WeatherData {
  _id: string;
  location: string;
  weatherData: any;
  note: string;
  createdAt: string;
}

const History: React.FC = () => {
  const [weatherRecords, setWeatherRecords] = useState<WeatherData[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<WeatherData | null>(null);
  const [editLocation, setEditLocation] = useState<string>('');
  const [editNote, setEditNote] = useState<string>(''); // New state for note
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/weather');
      console.log('Fetched records:', response.data);
      setWeatherRecords(response.data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to load weather history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOpen = (record: WeatherData) => {
    setEditingRecord(record);
    setEditLocation(record.location);
    setEditNote(record.note || '');
  };

  const handleEditSave = async () => {
    if (!editingRecord) return;
    try {
      await axios.put(`http://localhost:5000/api/weather/${editingRecord._id}`, {
        location: editLocation,
        note: editNote,
      });
      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Failed to update record.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/weather/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete record.');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchRecords}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent mb-3">
              📜 Weather History
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              View and manage your saved weather records
            </p>
            <div className="text-sm text-slate-500 mb-8">
              Built by <span className="font-semibold text-slate-700">[Your Name]</span>
            </div>
            <div className="flex justify-center gap-4">
              <Link to="/">
                <button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </button>
              </Link>
              <button
                onClick={fetchRecords}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <ExportData />

          {isLoading && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 mt-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                <span className="text-slate-700 font-semibold text-lg">Loading records...</span>
              </div>
            </div>
          )}

          {!isLoading && weatherRecords.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                📋 Saved Records
              </h2>
              <div className="space-y-4">
                {weatherRecords.map((record) => (
                  <div
                    key={record._id}
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">City: {record.location}</p>
                        <p className="text-sm text-slate-600">
                          Saved: {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                        {record.note && (
                          <p className="text-sm text-slate-600 italic">Note: {record.note}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleExpand(record._id)}
                          className="relative text-blue-500 hover:text-blue-700 transition-colors duration-200"
                          title="More Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="absolute hidden group-hover:block bg-slate-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                            More Details
                          </span>
                        </button>
                        <button
                          onClick={() => handleEditOpen(record)}
                          className="relative text-yellow-500 hover:text-yellow-700 transition-colors duration-200 group"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828l-2.828.586.586-2.828L16.414 6.586z" />
                          </svg>
                          <span className="absolute hidden group-hover:block bg-slate-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="relative text-red-500 hover:text-red-700 transition-colors duration-200 group"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zm-7 4h18" />
                          </svg>
                          <span className="absolute hidden group-hover:block bg-slate-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>

                    {expandedRecord === record._id && (
                      <div className="mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 animate-fade-in">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={`http://openweathermap.org/img/wn/${record.weatherData.list[0].weather[0].icon}@2x.png`}
                            alt={record.weatherData.list[0].weather[0].description}
                            className="w-12 h-12"
                          />
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">
                              {record.weatherData.city.name}
                            </h4>
                            <p className="text-sm capitalize text-slate-600">
                              {record.weatherData.list[0].weather[0].description}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>
                              <span className="font-semibold">Temperature:</span>{' '}
                              {Math.round(record.weatherData.list[0].main.temp - 273.15)}°C
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            <p>
                              <span className="font-semibold">Feels Like:</span>{' '}
                              {Math.round(record.weatherData.list[0].main.feels_like - 273.15)}°C
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p>
                              <span className="font-semibold">Humidity:</span>{' '}
                              {record.weatherData.list[0].main.humidity}%
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p>
                              <span className="font-semibold">Wind Speed:</span>{' '}
                              {record.weatherData.list[0].wind.speed} m/s
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && weatherRecords.length === 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-16 text-center mt-8">
              <div className="text-6xl mb-6 opacity-80">📂</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No Weather Records
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                Save weather data from the home page to view and manage your records here.
              </p>
              <Link to="/" className="mt-6 inline-block">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Go to Home
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {editingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Record</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">City Name</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-900 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Note</label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-900 bg-white/80 backdrop-blur-sm"
                  rows={3}
                  placeholder="Add a note about this search..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingRecord(null)}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-sm border-t border-slate-200/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-600 font-medium">
            Manage your weather history with ease 📜
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;