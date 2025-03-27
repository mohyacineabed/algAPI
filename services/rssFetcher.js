const axios = require('axios');
const { Readable } = require('stream');
const FeedParser = require('feedparser');
const FeedItem = require('../models/Feed');

// Map RSS sources to categories
const RSS_SOURCES = {
  'http://feeds.aps.dz/aps-economie': 'economy',
  'http://feeds.aps.dz/aps-algerie': 'politics',
  'http://www.alger-republicain.com/spip.php?page=backend': 'politics',
  'http://feeds.aps.dz/aps-societe': 'society',
  'http://feeds.aps.dz/aps-culture': 'culture',
  'http://feeds.aps.dz/aps-regions': 'regions',
  'http://feeds.aps.dz/APS-Sante-Science-Technologie': 'health-sience-technology',
  'http://feeds.aps.dz/aps-sport': 'sport'
};

const fetchRSSFeeds = async () => {
  for (const [sourceUrl, category] of Object.entries(RSS_SOURCES)) {
    try {
      const response = await axios.get(sourceUrl, {
        responseType: 'text',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': sourceUrl.split('/')[2]
        }
      });

      // Convert response data to a stream
      const stream = new Readable();
      stream.push(response.data);
      stream.push(null);

      const feedparser = new FeedParser();
      stream.pipe(feedparser);

      feedparser.on('error', (error) => {
        console.error(`Feedparser error for ${sourceUrl}:`, error);
      });

      feedparser.on('readable', async function () {
        let item;
        while ((item = this.read())) {
          try {
            await FeedItem.findOneAndUpdate(
              { link: item.link },
              {
                source: item.meta.title,
                title: item.title,
                description: item.description,
                link: item.link,
                pubDate: item.pubdate,
                author: item.author,
                guid: item.guid,
                categories: item.categories,
                category, // Assign the mapped category
                source_url: sourceUrl
              },
              { upsert: true, new: true }
            );
          } catch (error) {
            console.error('Error saving feed item:', error);
          }
        }
      });
    } catch (error) {
      console.error(`Error fetching RSS from ${sourceUrl}:`, error.message);
    }
  }
};

module.exports = fetchRSSFeeds;