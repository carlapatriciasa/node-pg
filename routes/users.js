var express = require('express')
var router = express.Router()
var db = require('../db/connect')
var criptografia = require('../config/criptografia')
var passport = require('passport')

// antes de fazer qualquer coisa, verifica se está autenticado
router.use(function (req, res, next) {
  if (
    req.isAuthenticated() &&
    ['/users/login', '/users/cadastro'].indexOf(req.originalUrl) > -1
  ) {
    return res.redirect('/')
  }
  next()
})

/* GET users listing. */
router.get('/cadastro', function (req, res, next) {
  res.render('../views/users/cadastro', {
    title: 'Cadastro de Usuário',
    user: {},
    nome: ''
  })
})

router.get('/login', function (req, res, next) {
  res.render('../views/users/login', {
    title: 'Acesso ao Sistema',
    nome: ''
  })
})

router.post('/login', function (req, res, next) {
  if (!(req.body.cli_email && req.body.cli_senha)) {
    res.render('../views/users/login', {
      title: 'Acesso ao Sistema',
      error: 'Todos os campos são obrigatórios!',
      user: req.body // é aqui que estão as variáveis enviadas pelo formulário
    })
  }
  try {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        res.render('../views/users/login', {
          title: 'Acesso ao Sistema',
          error: err,
          user: req.body
        })
      }

      if (!user) {
        res.render('../views/users/login', {
          title: 'Acesso ao Sistema',
          error: 'Erro desconhecido!',
          user: req.body
        })
      }

      // req / res held in closure
      req.logIn(user, function (err) {
        if (err) {
          res.render('../views/users/login', {
            title: 'Acesso ao Sistema',
            error: err,
            user: req.body
          })
        }

        return res.redirect('/')
      })
    })(req, res)
  } catch (error) {
    res.render('../views/users/login', {
      title: 'Acesso ao Sistema',
      error: error,
      user: req.body
    })
  }
})

router.post('/cadastro', async function (req, res, next) {
  var user = req.body

  var sql = `SELECT * FROM cliente WHERE cli_email = $1`

  var userInDb = await db.query(sql, [user.cli_email])

  if (userInDb.rowCount > 0) {
    req.body.cli_senha = ''
    req.body.confirmacao_senha = ''
    return res.render('../views/users/cadastro', {
      title: 'Cadastro de Usuário',
      error: 'Este email já está cadastrado no nosso sistema!',
      user: req.body
    })
  }

  var senha = criptografia.hashPwd(user.cli_senha)
  sql = `
  INSERT INTO cliente(cli_email, cli_senha, cli_nome)
  VALUES ($1, $2, $3);`

  try {
    var result = await db.query(sql, [
      user.cli_email,
      senha,
      user.cli_nome
    ])

    if (result.rowCount === 0) {
      req.body.cli_senha = ''
      req.body.confirmacao_senha = ''
      return res.render('../views/users/cadastro', {
        title: 'Cadastro de Usuário',
        error: 'Não foi possível incluir o usuário!',
        user: req.body
      })
    }
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        req.body.cli_senha = ''
        req.body.confirmacao_senha = ''
        return res.render('../views/users/cadastro', {
          title: 'Cadastro de Usuário',
          error: err,
          user: req.body
        })
      }

      if (!user) {
        req.body.cli_senha = ''
        req.body.confirmacao_senha = ''
        return res.render('../views/users/cadastro', {
          title: 'Cadastro de Usuário',
          error: 'Erro desconhecido!',
          user: req.body
        })
      }

      // req / res held in closure
      req.logIn(user, function (err) {
        if (err) {
          req.body.cli_senha = ''
          req.body.confirmacao_senha = ''
          return res.render('../views/users/cadastro', {
            title: 'Cadastro de Usuário',
            error: err,
            user: req.body
          })
        }

        return res.redirect('/')
      })
    })(req, res)
  } catch (error) {
    req.body.cli_senha = ''
    req.body.confirmacao_senha = ''
    return res.render('../views/users/cadastro', {
      title: 'Cadastro de Usuário',
      error: error,
      user: req.body
    })
  }
})

router.get('/logout', function (req, res, next) {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
