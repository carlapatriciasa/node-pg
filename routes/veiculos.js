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
  var veiculos = []

  var sql = 'select * from veiculo where cli_codigo = $1'
  var param = [req.user.cli_codigo]

  var result = await db.query(sql, param)

  if (result.rowCount > 0) {
    veiculos = result.rows
  }

  res.render('../views/veiculos/index', {
    title: 'Consulta de Veiculos',
    cli_nome: req.user.cli_nome,
    veiculos: veiculos
  })
})

/* GET CADASTROS */
router.get('/cadastro/:codigo?', async (req, res, next) => {
  var codigo = req.params.codigo
  var veiculo = {}

  if (codigo) {
    var sql = 'select * from veiculo where vei_codigo = $1'

    var result = await db.query(sql, [codigo])

    if (result.rowCount > 0) {
      veiculo = result.rows[0]
    }
  }

  res.render('../views/veiculos/cadastro', {
    title: 'Cadastro de Veiculos',
    cli_nome: req.user.cli_nome,
    veiculo: veiculo
  })
})

/* POST CADASTRO */
router.post('/cadastro/', async (req, res, next) => {
  var v = req.body
  var sql = ''
  var params = []

  if (v.vei_codigo && v.vei_codigo > 0) {
    // UPDATE DOS DADOS
    sql = 'update veiculo set vei_tipo = $1, vei_marca = $2, vei_modelo = $3, vei_placa = $4 where vei_codigo = $5'
    params = [v.vei_tipo, v.vei_marca, v.vei_modelo, v.vei_placa, v.vei_codigo]
  } else {
    // INSERT DOS DADOS
    sql = 'insert into veiculo (cli_codigo, vei_tipo, vei_marca, vei_modelo, vei_placa) values ($1,$2, $3, $4, $5)'
    params = [req.user.cli_codigo, v.vei_tipo, v.vei_marca, v.vei_modelo, v.vei_placa]
  }

  var result = await db.query(sql, params)

  if (result.rowCount > 0) {
    return res.redirect('/veiculos/')
  }

  return res.render('../views/veiculos/cadastro/', {
    title: 'Cadastro de Veiculo',
    nome: 'Ocorreu algum erro',
    veiculo: v
  })
})

/* GET EXCLUIR */
router.get('/excluir/:codigo', async (req, res, next) => {
  var codigo = req.params.codigo
  var veiculo = {}

  if (codigo) {
    var sql = 'select * from veiculo where vei_codigo = $1'

    var result = await db.query(sql, [codigo])

    if (result.rowCount > 0) {
      veiculo = result.rows[0]
    }
  } else {
    return res.redirect('/veiculos/')
  }

  res.render('../views/veiculos/excluir', {
    title: 'Exclusão de Veiculos',
    cli_nome: req.user.cli_nome,
    veiculo: veiculo
  })
})

/* POST EXCLUIR */
router.post('/excluir/', async (req, res, next) => {
  var v = req.body
  var sql = 'delete from veiculo where vei_codigo = $1 and cli_codigo = $2'
  var params = [v.vei_codigo, req.user.cli_codigo]

  var result = await db.query(sql, params)

  return res.redirect('/veiculos/')
})

module.exports = router
