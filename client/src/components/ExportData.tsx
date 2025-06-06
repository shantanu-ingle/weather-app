import { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ExportData: React.FC = () => {
  const [format, setFormat] = useState<'json' | 'csv' | 'markdown'>('json');
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/weather');
      const data = response.data;

      let content: string;
      let filename: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(data, null, 2);
          filename = 'weather_data.json';
          break;
        case 'csv':
          content = 'ID,Location,CreatedAt\n' +
            data.map((item: any) =>
              `${item._id},${item.location},${item.createdAt}`
            ).join('\n');
          filename = 'weather_data.csv';
          break;
        case 'markdown':
          content = '# Weather Data\n\n' +
            data.map((item: any) =>
              `- **ID**: ${item._id}\n  **Location**: ${item.location}\n  **Saved**: ${new Date(item.createdAt).toLocaleDateString()}\n`
            ).join('\n');
          filename = 'weather_data.md';
          break;
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        📤 Export Weather Data
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as 'json' | 'csv' | 'markdown')}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-900 bg-white/80 backdrop-blur-sm"
          disabled={isLoading}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="markdown">Markdown</option>
        </select>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportData;