const roteador = require('express').Router()
const tabelaFornecedor = require('./tabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async (req, res) => {
    const resultados = await tabelaFornecedor.listar()
    res.send(JSON.stringify(resultados))
})

roteador.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id: id })

        await fornecedor.carregar()
        res.send(JSON.stringify(fornecedor))
    } catch (error) {
        res.send(JSON.stringify(error.message))
    }
})

roteador.post('/', async (req, res) => {
    const fornecedor = new Fornecedor(req.body)

    await fornecedor.criar()
    res.send(JSON.stringify(fornecedor))
})

roteador.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor(Object.assign({}, req.body, { id: id }))

        await fornecedor.atualizar()

        res.send(`Fornecedor de ID ${id} foi atualizado\nNovos valores: ${JSON.stringify(req.body)}`)
    } catch (error) {
        res.send(JSON.stringify(error.message))
    }
})

module.exports = roteador