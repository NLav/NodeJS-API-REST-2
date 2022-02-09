const roteador = require('express').Router({ mergeParams: true })
const tabela = require('./tabela')
const Produto = require('./Produto')
const SerializadorProduto = require('../../Serializador').SerializadorProduto

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.options('/:idProduto', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'PUT', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.options('/:idProduto/diminuirestoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'PATCH')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res) => {
    const produtos = await tabela.listar(req.fornecedor.id)
    const serializador = new SerializadorProduto(res.getHeader('Content-type'))

    res.status(200).send(serializador.serializar(produtos))
})

roteador.get('/:idProduto', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)
        const serializador = new SerializadorProduto(res.getHeader('Content-Type'), ['estoque', 'dataCriacao', 'dataAtualizacao', 'versao'])

        await produto.carregar()

        res.set('ETag', produto.versao)
        res.set('Last-Modified', (new Date(produto.dataAtualizacao)).getTime())
        res.status(200).send(serializador.serializar(produto))
    } catch (error) {
        next(error)
    }
})

roteador.head('/:idProduto', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)

        await produto.carregar()

        res.set('ETag', produto.versao)
        res.set('Last-Modified', (new Date(produto.dataAtualizacao)).getTime())

        res.status(200).end()
    } catch (error) {
        next(error)
    }
})

roteador.post('/', async (req, res, next) => {
    try {
        const id = req.fornecedor.id
        const valores = req.body
        const dados = Object.assign({}, valores, { fornecedor: id })
        const produto = new Produto(dados)
        const serializador = new SerializadorProduto(res.getHeader('Content-Type'))

        await produto.criar()

        res.set('ETag', produto.versao)
        res.set('Last-Modified', (new Date(produto.dataAtualizacao)).getTime())
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        res.status(201).send(serializador.serializar(produto))
    } catch (error) {
        next(error)
    }
})

roteador.put('/:idProduto', async (req, res, next) => {
    try {
        const produto = new Produto(Object.assign({}, req.body, { id: req.params.idProduto, fornecedor: req.fornecedor.id }))

        await produto.atualizar()
        await produto.carregar()

        res.set('ETag', produto.versao)
        res.set('Last-Modified', (new Date(produto.dataAtualizacao)).getTime())
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

roteador.delete('/:idProduto', async (req, res) => {
    const dados = {
        fornecedor: req.fornecedor.id,
        id: req.params.idProduto
    }

    const produto = new Produto(dados)

    await produto.deletar()

    res.status(204).end()
})

roteador.patch('/:idProduto/diminuirestoque', async (req, res, next) => {
    try {
        const produto = new Produto({
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        })
        await produto.carregar()

        produto.estoque = produto.estoque - req.body.quantidade

        await produto.diminuirEstoque()
        await produto.carregar()

        res.set('ETag', produto.versao)
        res.set('Last-Modified', (new Date(produto.dataAtualizacao)).getTime())
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = roteador