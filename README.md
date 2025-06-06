# Weather App

A full-stack weather application providing real-time weather data, 5-day forecasts, geolocation support, air quality, and historical weather search management with interactive weather maps.

## Features





Real-time weather for any city or via geolocation.



5-day forecast with temperature, precipitation, and weather details.



Air quality data (PM2.5, PM10, CO, SO2) with health status.



Combined temperature and precipitation trend graph.



Historical weather search management (view, edit city/note, delete, export as JSON/CSV/Markdown).



Live weather map with togglable layers (clouds, wind, temperature) using Leaflet.



Branded with [Your Name] and PM Accelerator LinkedIn link.

## Tech Stack





Frontend: React, TypeScript, TailwindCSS v4, Vite



Backend: Node.js, Express



Database: MongoDB



Libraries:





Chart.js & react-chartjs-2 (graphs)



Leaflet & react-leaflet (interactive weather maps)



Axios (API requests)



File-saver (data export)

## APIs Used





OpenWeatherMap API:





Weather data (/data/2.5/forecast)



Air pollution data (/data/2.5/air_pollution)



Reverse geocoding (/geo/1.0/reverse)



Weather map layers (clouds, wind, temperature)



OpenStreetMap (via Leaflet for base map tiles)

## Setup
1. Clone repo: `git clone <repo-url>`.
2. Install frontend: `cd client && npm install`.
3. Install backend: `cd ../server && npm install`.
4. Create `.env` in `/server` for API keys and DB URI.
5. Run backend: `cd server && npm run dev`.
6. Run frontend: `cd client && npm start`.

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB