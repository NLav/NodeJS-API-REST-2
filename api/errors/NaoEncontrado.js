class NaoEncontrado extends Error {
    constructor(nome) {
        super(`${nome} não foi encontrado`)
        this.name = 'NaoEncontrado'
        this.id = 0
    }
}

module.exports = NaoEncontrado