import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/weather');
      setWeatherRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Export Section */}
          <ExportData />

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 mt-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                <span className="text-slate-700 font-semibold text-lg">Loading records...</span>
              </div>
            </div>
          )}

          {/* Weather Records */}
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
                    {editingId === record._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-900 bg-white/80 backdrop-blur-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(record._id)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Location: {record.location}</p>
                          <p className="text-sm text-slate-600">
                            Date Range: {new Date(record.dateRange.start).toLocaleDateString()} -{' '}
                            {new Date(record.dateRange.end).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(record._id);
                              setEditLocation(record.location);
                            }}
                            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828l-2.828.586.586-2.828L16.414 6.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zm-7 4h18" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
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

      {/* Footer */}
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