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
  var sql = `select cli_codigo, cli_nome, cli_email from cliente where cli_email = $1`
  var param = [req.user.cli_email]

  var result = await db.query(sql, param)

  if (result.rowCount === 0) {
    return res.redirect('/users/login')
  }

  res.render('../views/perfil/index', {
    title: 'Consulta de Perfil',
    cli_nome: req.user.cli_nome,
    perfil: result.rows[0]
  })
})

router.post('/index', async (req, res, next) => {
  var perfil = req.body
  var params = []

  var sql = ''

  if (perfil.cli_nome && perfil.cli_nome > 0) {
    sql = `
    UPDATE perfil SET cli_nome = $1
    `
    params = [perfil.cli_nome]

    var result = await db.query(sql, params)

    if (result.rowCount > 0) {
      return res.redirect('/')
    }
  }

  return res.render('../views/perfil/index', {
    title: 'Cadastro de perfil',
    nome: 'Ocorreu algum erro',
    perfil: perfil
  })
})

// router.post('/delete/', async function (req, res, next) {
//   var id = req.body.id
//   var sql = `
//   DELETE FROM perfil WHERE id = $1
//   `

//   var result = await db.query(sql, [id])

//   if (result.rowCount === 0) {
//     return res.json({excluiu: false, err: 'Ocorreu um erro desconhecido!'})
//   }

//   return res.json({excluiu: true})
// })

module.exports = router
