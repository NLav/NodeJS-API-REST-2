const roteador = require('express').Router()
const tabela = require('./tabela')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor
const roteadorProdutos = require('../produtos')

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'POST')
    res.set('Access-Control-Allow-Heagers', 'Content-Type')
    res.status(204).end()
})

roteador.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'PUT', 'DELETE')
    res.set('Access-Control-Allow-Heagers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res) => {
    const fornecedores = await tabela.listar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'),  ['categoria'])

    res.status(200).send(serializador.serializar(fornecedores))
})

roteador.get('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['categoria', 'email', 'dataCriacao', 'dataAtualizacao', 'versao'])

        await fornecedor.carregar()

        res.status(200).send(serializador.serializar(fornecedor))
    } catch (error) {
        next(error)
    }
})

roteador.post('/', async (req, res, next) => {
    try {
        const fornecedor = new Fornecedor(req.body)
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['categoria'])

        await fornecedor.criar()

        res.status(201).send(serializador.serializar(fornecedor))
    } catch (error) {
        next(error)
    }
})

roteador.put('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor(Object.assign({}, req.body, { id: id }))

        await fornecedor.atualizar()

        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

roteador.delete('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })

        await fornecedor.carregar()
        await fornecedor.deletar()

        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

const verificarFornecedor = async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })

        await fornecedor.carregar()

        req.fornecedor = fornecedor

        next()
    } catch (error) {
        next(error)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador