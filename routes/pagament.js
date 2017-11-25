var express = require('express')
var router = express.Router()
var db = require('../db/connect')

// antes de fazer qualquer coisa, verifica se está autenticado
router.use(function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login')
  }
  next()
})

/* GET home page. */
router.get('/', async (req, res, next) => {
  var pagament = []

  var sql = 'select * from cartao where cli_codigo = $1'
  var param = [req.user.cli_codigo]

  var result = await db.query(sql, param)

  if (result.rowCount > 0) {
    pagament = result.rows
  }

  res.render('../views/pagament/index', {
    title: 'Consulta de Cartao',
    cli_nome: req.user.cli_nome,
    pagament: pagament
  })
})

/* GET CADASTROS */
router.get('/cartao/:codigo?', async (req, res, next) => {
  var codigo = req.params.codigo
  var pagament = {}

  if (codigo) {
    var sql = 'select * from cartao where cart_codigo = $1'

    var result = await db.query(sql, [codigo])

    if (result.rowCount > 0) {
      pagament = result.rows[0]
    }
  }

  res.render('../views/pagament/cartao', {
    title: 'Cadastro de cartao',
    cli_nome: req.user.cli_nome,
    pagament: pagament
  })
})

/* POST CADASTRO */
router.post('/cartao/', async (req, res, next) => {
  var v = req.body
  var sql = ''
  var params = []

  if (v.cart_codigo && v.cart_codigo > 0) {
    // UPDATE DOS DADOS
    sql = 'update cartao set cart_tipo = $1, cart_nome = $3 cart_num_cartao = $4, cart_dt_validade = $5, cart_cod_seg = $6 where cart_codigo = $6'
    params = [v.cart_tipo, v.cart_cpf, v.cart_nome, v.cart_num_cartao, v.cart_dt_validade, v.cart_codigo, v.cart_cod_seg]
  } else {
    // INSERT DOS DADOS
    sql = 'insert into cartao (cart_tipo, cart_nome, cart_num_cartao, cart_dt_validade, cart_cod_seg, cli_codigo) values ($1, $2, $3, $4, $5, $6)'
    params = [v.cart_tipo, v.cart_nome, v.cart_num_cartao, v.cart_dt_validade, v.cart_cod_seg, req.user.cli_codigo]
  }

  var result = await db.query(sql, params)

  if (result.rowCount > 0) {
    return res.redirect('/pagament/')
  }

  return res.render('../views/pagament/cartao/', {
    title: 'Cadastro de cartao',
    nome: 'Ocorreu algum erro',
    pagament: v
  })
})



module.exports = router
