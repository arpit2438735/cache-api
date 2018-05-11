const express = require('express');
const controller = require('../../controllers/cache.controller');

const router = express.Router();

/**
 * @api {post} v1/cache
 * @apiDescription Creates an entry in the cache
 * @apiParam {string} key
 * @apiParam {string} valye
 * @apiParam {number} ttl optional
 */
router.post('/', controller.createEntry);

/**
 * @api {get} v1/cache
 * @apiDescription Get all entry from cache
 */
router.get('/', controller.getAllEntry);

module.exports = router;
