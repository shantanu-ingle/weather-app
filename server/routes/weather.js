const express = require('express');
const router = express.Router();
const WeatherData = require('../models/WeatherData');
const axios = require('axios');

router.post('/', async (req, res) => {
  const { location, startDate, endDate } = req.body;
  try {
    let url;
    if (location.includes(',')) {
      const [lat, lon] = location.split(',');
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`;
    }
    const response = await axios.get(url);
    const weatherData = new WeatherData({
      location,
      dateRange: { start: startDate, end: endDate },
      weatherData: response.data,
    });
    await weatherData.save();
    res.status(201).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch or save data' });
  }
});

// Other routes (READ, UPDATE, DELETE) remain unchanged
module.exports = router;