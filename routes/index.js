var express = require('express');
var router = express.Router();
var Redis = require('ioredis');

var redis = new Redis('redis://' + process.env['DATA_SOURCE_REDIS'])

/* GET home page. */
router.get('/', function(req, res, next) {
  redis.info().then( info => {
    res.type('text').send(info);
  }).catch( err => {
    res.status(500).type('text').send(err)
  });
});

module.exports = router;
