var express = require('express')
var router = express.Router()
// var db = require('../db/connect')

// antes de fazer qualquer coisa, verifica se está autenticado
router.use(function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login')
  }
  next()
})

/* GET home page. */
router.get('/', async (req, res, next) => {

  res.render('../views/mapa/', {
    title: 'Mapa',
    cli_nome: req.user.cli_nome
  })

})


module.exports = router
