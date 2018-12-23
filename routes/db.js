const express = require('express')
const Redis = require('ioredis')
const assert = require('assert')
const {MongoClient} = require('mongodb')
const {createConnection} = require('mysql')

const router = express.Router()

const redis = new Redis('redis://' + (process.env['DATA_SOURCE_REDIS'] || 'localhost'))

let mongodb, mysql

MongoClient.connect(`mongodb://${process.env['DATA_SOURCE_MONGODB'] || 'localhost'}`, (err, client) => {
  assert.equal(null, err)
  mongodb = client.db('test')
});

mysql = createConnection(`mysql://root:@${process.env['DATA_SOURCE_MYSQL'] || 'localhost'}/test`)
mysql.connect()

router.get('/redis', (req, res, next) => {
  redis.info().then( info => {
    res.type('text').send(info)
  }).catch(next)
})

router.get('/mongodb', (req, res, next) => {
  mongodb.admin().serverStatus().then( status => {
    res.type('json').send(status);
  }).catch(next)
})

router.get('/mysql', (req, res, next) => {
  mysql.query('SELECT 1', (err, results) => {
    if (err) {
      next(err)
    } else {
      res.type('json').send(results)
    }
  })
})

module.exports = router;
