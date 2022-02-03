const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const app = express()

const roteadorFornecedores = require('./routes/fornecedores')


app.use(bodyParser.json())

app.use('/api/fornecedores', roteadorFornecedores)

app.listen(config.get('api.port'), () => console.log('API rodando na porta 3000'))