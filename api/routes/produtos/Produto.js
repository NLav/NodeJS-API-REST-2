const tabela = require('./tabela')

class Produto {
    constructor({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataModificacao, versao }) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataModificacao = dataModificacao
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
        this.dataModificacao = resultado.dataModificacao
        this.versao = resultado.versao
    }

    deletar() {
        return tabela.deletar(this.fornecedor, this.id)
    }

    validar() {
        if (typeof this.titulo !== 'string' || this.titulo === '') {
            throw new Error('O campo "titulo" não é válido')
        }
        
        if (typeof this.preco !== 'number' || this.preco === 0) {
            throw new Error('O campo "preço" não é válido')
        }
    }
}

module.exports = Produto