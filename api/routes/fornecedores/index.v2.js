const roteador = require('express').Router()
const tabela = require('./tabela')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'POST')
    res.set('Access-Control-Allow-Heagers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res) => {
    const fornecedores = await tabela.listar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))

    res.status(200).send(serializador.serializar(fornecedores))
})

module.exports = roteador