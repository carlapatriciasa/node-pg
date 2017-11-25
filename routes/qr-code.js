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
    res.render('../views/qr-code/index', {
        title: 'Consulta de Cartao',
        cli_nome: req.user.cli_nome,
        qrcode: qrcode
    })

    var qrcode = new QRCode("qrcode");

    function makeCode() {
        var elText = document.getElementById("text");

        if (!elText.value) {
            alert("Input a text");
            elText.focus();
            return;
        }

        qrcode.makeCode(elText.value);
    }

    makeCode();

    $("#text").
        on("blur", function () {
            makeCode();
        }).
        on("keydown", function (e) {
            if (e.keyCode == 13) {
                makeCode();
            }
        });
})



module.exports = router