const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
  location: { type: String, required: true },
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  weatherData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WeatherData', WeatherDataSchema);