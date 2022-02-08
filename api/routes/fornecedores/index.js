const roteador = require('express').Router()
const tabela = require('./tabela')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor
const roteadorProdutos = require('../produtos')

roteador.get('/', async (req, res) => {
    const resultados = await tabela.listar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))

    res.status(200).send(serializador.serializar(resultados))
})

roteador.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id: id })
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['email', 'dataCriacao', 'dataAtualizacao', 'versao'])

        await fornecedor.carregar()

        res.status(200).send(serializador.serializar(fornecedor))
    } catch (error) {
        next(error)
    }
})

roteador.post('/', async (req, res, next) => {
    try {
        const fornecedor = new Fornecedor(req.body)
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))

        await fornecedor.criar()

        res.status(201).send(serializador.serializar(fornecedor))
    } catch (error) {
        next(error)
    }
})

roteador.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor(Object.assign({}, req.body, { id: id }))

        await fornecedor.atualizar()

        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

roteador.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id: id })

        await fornecedor.carregar()
        await fornecedor.remover()

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