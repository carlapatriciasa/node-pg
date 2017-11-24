var express = require('express')
var router = express.Router()
var db = require('../db/connect')

router.use(function (req, res, next) {
  next()
})

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: '', cli_nome: (req.user ? req.user.cli_nome : '') })
})

module.exports = router
