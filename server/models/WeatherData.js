const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
  location: { type: String, required: true },
  weatherData: { type: Object, required: true },
  airQuality: { type: Object }, 
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WeatherData', WeatherDataSchema);