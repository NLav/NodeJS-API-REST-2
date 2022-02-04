const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const roteadorFornecedores = require('./routes/fornecedores')
const NaoEncontrado = require('./errors/NaoEncontrado')
const CampoInvalido = require('./errors/CampoInvalido')
const DadosNaoFornecidos = require('./errors/DadosNaoFornecidos')
const ValorNaoSuportado = require('./errors/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro
const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    let formatoRequisitado = req.header('Accept')

    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406).end()
        return 
    }

    res.setHeader('Content-Type', formatoRequisitado)
    next()
})

app.use('/api/fornecedores', roteadorFornecedores)

app.use((error, req, res, next) => {
    let status = 500

    if (error instanceof NaoEncontrado) {
        status = 404
    }

    if (error instanceof CampoInvalido || error instanceof DadosNaoFornecidos) {
        status = 400
    }

    if (error instanceof ValorNaoSuportado) {
        status = 406
    }

    const serializador = new SerializadorErro(res.getHeader('Content-Type'))

    res.status(status).send(serializador.serializar(
        {
            idErro: error.id,
            mensagem: error.message,
        }
    ))
})

app.listen(config.get('api.port'), () => console.log('API rodando na porta 3000'))