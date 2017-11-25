var db = require('./connect')
var teste = async function() {
    var email = 'exemple@exemple.com'
    var resultado = await db.query('SELECT * FROM cartao')

    if (resultado.rowCount > 0) {
        console.log(resultado.rows)
    } else{

        console.log('Nenhum Resultado Encontrado')
    }

}

teste()