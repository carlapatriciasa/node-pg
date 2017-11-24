const criptografia = require('../criptografia')
const LocalStrategy = require('passport-local').Strategy
const db = require('../../db/connect')
var passport = require('passport')

module.exports = function () {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'cli_email',
        passwordField: 'cli_senha'
      },
      async function (cli_email, cli_senha, cb) {
        var sql = 'SELECT * FROM cliente WHERE cli_email=$1'
        var result = await db.query(sql, [cli_email])

        if (result.rowCount > 0) {
          const first = result.rows[0]
          var isEqual = criptografia.compare(cli_senha, first.cli_senha)
          if (isEqual) {
            cb(null, {
              cli_codigo: first.cli_codigo,
              cli_email: first.cli_email,
              cli_nome: first.cli_nome
            })
          } else {
            cb(null, false)
          }
        } else {
          cb(null, false)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, cb) => {
    db.query(
      'SELECT id, cli_email, cli_nome FROM cliente WHERE cli_email=$1',
      [parseInt(id, 10)],
      (err, results) => {
        if (err) {
          console.log('Error when selecting user on session deserialize', err)
          return cb(err)
        }

        cb(null, results.rows[0])
      }
    )
  })
}
