const express = require('express');
const router = express.Router();
const WeatherData = require('../models/WeatherData');
const axios = require('axios');

router.post('/', async (req, res) => {
  const { location } = req.body;
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
      weatherData: response.data,
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
      req.body,
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