class CampoInvalido extends Error {
    constructor (campo) {
        super(`O campo ${campo} não é válido`)
        this.name = 'CampoInvalido'
        this.id = 1
    }
}

module.exports = CampoInvalido