const express = require('express');
const cacheRoute = require('./cache.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/cache', cacheRoute);

module.exports = router;
