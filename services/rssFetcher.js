const axios = require('axios');
const { Readable } = require('stream'); // Import the Stream module
const FeedParser = require('feedparser');
const FeedItem = require('../models/Feed');

const RSS_SOURCES = [
  'http://feeds.aps.dz/aps-societe',
  'http://feeds.aps.dz/aps-culture',
  'http://feeds.aps.dz/aps-economie',
  'http://feeds.aps.dz/aps-algerie',
  'http://feeds.aps.dz/aps-regions',
  'http://feeds.aps.dz/APS-Sante-Science-Technologie',
  'http://feeds.aps.dz/aps-sport',
  'http://www.alger-republicain.com/spip.php?page=backend'
];

const fetchRSSFeeds = async () => {
  for (const sourceUrl of RSS_SOURCES) {
    try {
      const response = await axios.get(sourceUrl, {
        responseType: 'text', // Ensure the response is treated as text
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': sourceUrl.split('/')[2] // Use the domain as the referer
        }
      });

      // Convert the response data into a readable stream
      const stream = new Readable();
      stream.push(response.data); // Push the response data into the stream
      stream.push(null); // Signal the end of the stream

      const feedparser = new FeedParser();

      stream.pipe(feedparser); // Pipe the stream into FeedParser

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