const express = require('express');
const FeedItem = require('../models/Feed');
const logger = require('../utils/logger');
const router = express.Router();

// Get latest feed items
router.get('/latest', async (req, res) => {
  logger.info('Received request to fetch latest feed items');
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const feeds = await FeedItem.find()
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FeedItem.countDocuments();

    logger.info(`Returning ${feeds.length} feed items (Page: ${page}, Limit: ${limit})`);
    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: feeds
    });
  } catch (error) {
    logger.error('Error fetching latest feed items:', error.message);
    res.status(500).json({ message: 'Error fetching feeds', error: error.message });
  }
});

// Filter feeds by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  logger.info(`Received request to fetch feed items for category: ${category}`);
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const feeds = await FeedItem.find({ category })
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FeedItem.countDocuments({ category });

    logger.info(`Returning ${feeds.length} feed items for category: ${category} (Page: ${page}, Limit: ${limit})`);
    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: feeds
    });
  } catch (error) {
    logger.error(`Error filtering feeds by category (${category}):`, error.message);
    res.status(500).json({ message: 'Error filtering feeds by category', error: error.message });
  }
});

module.exports = router;