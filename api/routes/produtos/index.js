const roteador = require('express').Router({ mergeParams: true })
const tabela = require('./tabela')
const Produto = require('./Produto')

roteador.get('/', async (req, res) => {
    const produtos = await tabela.listar(req.fornecedor.id)

    res.send(JSON.stringify(produtos))
})

roteador.post('/', async (req, res, next) => {
    try {
        const id = req.fornecedor.id
        const valores = req.body
        const dados = Object.assign({}, valores, { fornecedor: id })
        const produto = new Produto(dados)

        await produto.criar()

        res.status(201).send(produto)
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

module.exports = roteador