var express = require('express')
var router = express.Router()
var db = require('../db/connect')

/* GET home page. */
router.get('/', async (req, res, next) => {

  res.render('../views/mapa/index', {
  })
})


module.exports = router
