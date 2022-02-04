class NaoEncontrado extends Error {
    constructor() {
        super('Fornecedor não foi encontrado')
        this.name = 'NaoEncontrado'
        this.id = 0
    }
}

module.exports = NaoEncontrado