const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/database');
const fetchRSSFeeds = require('./services/rssFetcher');
const feedRoutes = require('./routes/feedRoutes');
require('dotenv').config();
// Add near the top of app.js
const { setMaxListeners } = require('events');
setMaxListeners(0);

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/feeds', feedRoutes);

// Initial feed fetch and periodic updates
fetchRSSFeeds(); // Fetch immediately on startup
cron.schedule(`*/${process.env.UPDATE_INTERVAL || 30} * * * *`, () => {
  console.log('Updating RSS Feeds');
  fetchRSSFeeds();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});