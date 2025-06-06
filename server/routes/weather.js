const express = require('express');
const router = express.Router();
const WeatherData = require('../models/WeatherData');
const axios = require('axios');

router.post('/', async (req, res) => {
  const { location, note } = req.body;
  try {
    let url;
    let cityName = location;
    if (location.includes(',')) {
      const [lat, lon] = location.split(',');
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
      // Fetch city name using reverse geocoding
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
      );
      cityName = geoResponse.data[0]?.name || location;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`;
    }
    const response = await axios.get(url);
    const weatherData = new WeatherData({
      location: cityName, // Store city name instead of coordinates
      weatherData: response.data,
      note: note || '',
    });
    await weatherData.save();
    res.status(201).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch or save data' });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await WeatherData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedData = await WeatherData.findByIdAndUpdate(
      req.params.id,
      req.body, // Expects { location, note }
      { new: true }
    );
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await WeatherData.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

module.exports = router;