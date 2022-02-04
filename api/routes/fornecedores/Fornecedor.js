const tabelaFornecedor = require('./tabelaFornecedor')

class Fornecedor {
    constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    async criar() {
        const resultado = await tabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })
        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async carregar() {
        const resultado = await tabelaFornecedor.listarId(this.id)
        this.empresa = resultado.empresa
        this.email = resultado.email
        this.categoria = resultado.categoria
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async atualizar() {
        await tabelaFornecedor.listarId(this.id)

        const campos = ['empresa', 'email', 'categoria']
        const dados = {}

        campos.forEach((campo) => {
            const valor = this[campo]
            if (typeof (valor) === 'string' && valor.length > 0) {
                dados[campo] = valor
            }
        })

        if (Object.keys(dados).length === 0) {
            throw new Error('Um ou mais campos está vazio!')
        }

        await tabelaFornecedor.atualizar(this.id, dados)
    }
}

module.exports = Fornecedor