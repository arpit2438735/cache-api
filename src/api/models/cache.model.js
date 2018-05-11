const mongoose = require('mongoose');

const CacheSchema = mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  ttl: {
    type: Number,
    default: process.CACHE_TTL,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const CacheModel = mongoose.model('cache', CacheSchema);

/**
 * If the entries == MAX_CACHE_ENTRIES then it fetches the oldest
 * cache set and delete it, and create the new entry.
 */
CacheSchema.pre('save', (next) => {
  CacheModel.count({}, (err, count) => {
    if (!err) {
      const maxEntries = process.env.MAX_CACHE_ENTRIES;

      if (count >= maxEntries) {
        CacheModel.findOne({}, {}, { sort: { 'created_at': -1 }}, (err, cache) => {
          if (err) {
            console.error(`Error: ${err}`);
            return;
          }
          cache.remove();
        });
      }
    } else {
      console.error(`Error: ${err}`);
    }
  });
  next();
});

module.exports = CacheModel;
