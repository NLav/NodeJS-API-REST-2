class DadosNaoFornecidos extends Error {
    constructor() {
        super('Um ou mais campos estão vazios!')
        this.name = 'DadosNaoFornecidos'
        this.id = 2
    }
}

module.exports = DadosNaoFornecidos