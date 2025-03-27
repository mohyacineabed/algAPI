const express = require('express');
const FeedItem = require('../models/Feed');
const router = express.Router();

// Get latest feed items
router.get('/latest', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const feeds = await FeedItem.find()
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FeedItem.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: feeds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feeds', error: error.message });
  }
});

// Filter feeds by source or category
router.get('/filter', async (req, res) => {
  try {
    const { source, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = {};
    if (source) query.source = { $regex: source, $options: 'i' };
    if (category) query.categories = category;

    const feeds = await FeedItem.find(query)
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FeedItem.countDocuments(query);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: feeds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error filtering feeds', error: error.message });
  }
});

module.exports = router;