const moment = require('moment');

const httpStatus = require('http-status');
const Cache = require('../models/cache.model');

exports.createEntry = async (req, res, next) => {
  const {key, value, ttl} = req.body;
  const cache = new Cache({
    key,
    value: value || Math.random().toString(36),
    ttl: ttl || process.CACHE_TTL,
  });

  cache.save((err) => {
    if (!err) {
      res.status(httpStatus.CREATED);
      res.json({cache});
    } else {
      next(err);
    }
  });
};

exports.getAllEntry = async (req, res) => {
  const query = Cache.find({});

  query.exec((err, caches, next) => {
    if (err) {
      next(err);
      return;
    }

    res.status(httpStatus.OK);
    res.json({ caches });
  });
};

exports.getValueFromKey = async (req, res, next) => {
  const { key } = req.params;

  Cache.findOne({ key }, (err, cache) => {
    if (cache === null) {
      console.info('Cache miss');

      const newCacheEntry = new Cache({ key, value: Math.random().toString(36) });

      newCacheEntry.save((error) => {
        if (!error) {
          res.status(httpStatus.CREATED);
          res.json({
            value: newCacheEntry.value,
          });
        } else {
          next(error);
        }
      });
    } else {
      console.info('Cache hit');

      if (cache && cache.ttl) {
        let { ttl, key } = cache;

        const dateCreated = moment(cache.created_on, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        const dateToExpire = dateCreated.add(ttl, 'seconds');
        const hasExpired = moment().isAfter(dateToExpire);

        if (hasExpired) {
          cache.value = Math.random().toString(36);

          Cache.findOneAndUpdate({ key }, { value: cache.value }, (error, cache) => {
            if (error) {
              next(error);
            } else {
              res.status(httpStatus.OK);
              res.json({ value: cache.value });
            }
          });
        } else {
          res.status(httpStatus.OK);
          res.json({ value: cache.value });
        }
      }
    }
  });
};

exports.deleteAllEntry = async (req, res, next) => {
  Cache.deleteMany({}, (err) => {
    if (!err) {
      res.status(httpStatus.NO_CONTENT);
      res.json({});
    } else {
      next(err);
    }
  });
};


exports.deleteParticularEntry = async (req, res, next) => {
  const { key } = req.params;

  Cache.deleteOne({ key }, (err) => {
    if (!err) {
      res.status(httpStatus.NO_CONTENT);
      res.json({});
    } else {
      next(err);
    }
  });
};

exports.updateParticularEntry = async (req, res, next) => {
  const { key } = req.params;
  const { value } = req.body;

  Cache.findOneAndUpdate({ key }, { value }, (err, cache) => {
    if (!err) {
      if (cache === null) {
        res.status(httpStatus.NOT_FOUND);
        res.json({ message: 'Cache entry not found' });
      } else {
        res.status(httpStatus.NO_CONTENT);
        res.json({});
      }
    } else {
      next(err);
    }
  });
};
