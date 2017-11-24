var express = require('express')
var router = express.Router()
var db = require('../db/connect')

// antes de fazer qualquer coisa, verifica se está autenticado
router.use(function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login')
  }
  next()
})

/* GET home page. */
router.get('/', async (req, res, next) => {
  var result = await db.query('SELECT * FROM pessoa')

  res.render('../views/pessoas/index', {
    title: 'Consulta de Pessoas',
    nome: req.user.nome_completo,
    pessoas: result.rowCount > 0 ? result.rows : null
  })
})

router.get('/cadastro/:id?', async (req, res, next) => {
  var pessoa = {}

  if (req.params.id && req.params.id > 0) {
    var result = await db.query('SELECT * FROM pessoa WHERE id = $1', [req.params.id])

    if (result.rowCount > 0) {
      pessoa = result.rows[0]
    }
  }

  res.render('../views/pessoas/cadastro', {
    title: 'Cadastro de Pessoa',
    nome: req.user.nome_completo,
    pessoa: pessoa
  })
})

router.post('/cadastro/:id?', async (req, res, next) => {
  var pessoa = req.body
  var params = []

  var sql = ''

  if (pessoa.id && pessoa.id > 0) {
    sql = `
    UPDATE pessoa SET nome = $1, telefone = $2, cpf = $3 WHERE id = $4
    `
    params = [pessoa.nome, pessoa.telefone, pessoa.cpf, pessoa.id]
  } else {
    sql = `
    INSERT INTO pessoa (nome, telefone, cpf) VALUES ($1, $2, $3)
    `
    params = [pessoa.nome, pessoa.telefone, pessoa.cpf]
  }

  var result = await db.query(sql, params)

  if (result.rowCount > 0) {
    return res.redirect('/pessoas/')
  }

  return res.render('../views/pessoas/cadastro', {
    title: 'Cadastro de Pessoa',
    nome: 'Ocorreu algum erro',
    pessoa: pessoa
  })
})

router.post('/delete/', async function (req, res, next) {
  var id = req.body.id
  var sql = `
  DELETE FROM pessoa WHERE id = $1
  `

  var result = await db.query(sql, [id])

  if (result.rowCount === 0) {
    return res.json({excluiu: false, err: 'Ocorreu um erro desconhecido!'})
  }

  return res.json({excluiu: true})
})

module.exports = router
