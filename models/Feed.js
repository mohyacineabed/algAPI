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
    trim: true,
    required: true,
    unique: true
  },
  pubDate: {
    type: Date,
    default: Date.now
  },
  author: String,
  guid: String,
  categories: [String],
  source_url: String
}, { timestamps: true });

module.exports = mongoose.model('FeedItem', FeedItemSchema);