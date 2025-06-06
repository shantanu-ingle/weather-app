import { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ExportData: React.FC = () => {
  const [format, setFormat] = useState<'json' | 'csv' | 'markdown'>('json');

  const handleExport = async () => {
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
          content = 'ID,Location,StartDate,EndDate\n' +
            data.map((item: any) =>
              `${item._id},${item.location},${item.dateRange.start},${item.dateRange.end}`
            ).join('\n');
          filename = 'weather_data.csv';
          break;
        case 'markdown':
          content = '# Weather Data\n\n' +
            data.map((item: any) =>
              `- **ID**: ${item._id}\n  **Location**: ${item.location}\n  **Date Range**: ${new Date(item.dateRange.start).toLocaleDateString()} - ${new Date(item.dateRange.end).toLocaleDateString()}\n`
            ).join('\n');
          filename = 'weather_data.md';
          break;
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="mt-4">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as 'json' | 'csv' | 'markdown')}
        className="border p-2 rounded"
      >
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="markdown">Markdown</option>
      </select>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white p-2 rounded ml-2"
      >
        Export Data
      </button>
    </div>
  );
};

export default ExportData;