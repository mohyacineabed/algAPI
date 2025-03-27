const mongoose = require('mongoose');

const FeedItemSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  link: {
    type: String,
    required: true,
    unique: true
  },
  pubDate: {
    type: Date,
    default: Date.now
  },
  author: String,
  guid: String,
  categories: [String], // Original categories from the RSS feed
  category: {
    type: String,
    enum: [
      'economy',
      'politics',
      'society',
      'culture',
      'regions',
      'health-sience-technology',
      'sport'
    ],
    required: true
  },
  source_url: String
}, { timestamps: true });

module.exports = mongoose.model('FeedItem', FeedItemSchema);