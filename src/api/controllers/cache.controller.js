// Local imports
const Cache = require('../models/cache.model');
const httpStatus = require('http-status');

exports.createEntry = async(req, res) => {
  const { key, value, ttl } = req.body;
  const cache = new Cache({
    key,
    value: value || Math.random().toString(36),
    ttl: ttl || process.CACHE_TTL,
  });

  cache.save((err) => {
    if (!err) {
      res.status(httpStatus.CREATED);
      res.json({ cache });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.json({ message: `Error: ${err}` });
    }
  });
};

exports.getAllEntry = async(req, res) => {
  const query = Cache.find({});

  query.exec((err, caches) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.json({ message: `Error: ${err}` });
      return;
    }

    res.status(httpStatus.OK);
    res.json({ caches });
  });
};
