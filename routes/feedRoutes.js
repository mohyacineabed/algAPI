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

// Filter feeds by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const feeds = await FeedItem.find({ category })
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FeedItem.countDocuments({ category });

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: feeds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error filtering feeds by category', error: error.message });
  }
});

module.exports = router;