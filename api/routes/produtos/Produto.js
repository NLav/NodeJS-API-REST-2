const tabela = require('./tabela')
const DadosNaoFornecidos = require('../../errors/DadosNaoFornecidos')
const CampoInvalido = require('../../errors/CampoInvalido')

class Produto {
    constructor({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    async criar() {
        this.validar()

        const resultado = await tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async carregar() {
        const produto = await tabela.listarId(this.id, this.fornecedor)

        this.id = produto.id
        this.titulo = produto.titulo
        this.preco = produto.preco
        this.estoque = produto.estoque
        this.fornecedor = produto.fornecedor
        this.dataCriacao = produto.dataCriacao
        this.dataAtualizacao = produto.dataAtualizacao
        this.versao = produto.versao
    }

    async atualizar() {
        await tabela.listarId(this.id, this.fornecedor)

        const campos = ['titulo', 'preco', 'estoque']
        const dados = {}

        if (typeof (this.titulo) === 'string' && this.titulo.length > 0) {
            dados.titulo = this.titulo
        }

        if (typeof (this.preco) === 'number' && this.preco > 0) {
            dados.preco = this.preco
        }

        if (typeof (this.estoque) === 'number' && this.estoque >= 0) {
            dados.estoque = this.estoque
        }
        
        if (Object.keys(dados).length === 0) {
            throw new DadosNaoFornecidos()
        }

        await tabela.atualizar(this.id, this.fornecedor, dados)
    }

    deletar() {
        return tabela.deletar(this.id, this.fornecedor)
    }

    validar() {
        if (typeof this.titulo !== 'string' || this.titulo === '') {
            throw new CampoInvalido('titulo')
        }
        
        if (typeof this.preco !== 'number' || this.preco === 0) {
            throw new CampoInvalido('preco')
        }
    }

    diminuirEstoque() {
        return tabela.atualizarCampo(this.id, this.fornecedor, 'estoque', this.estoque)
    }
}

module.exports = Produto