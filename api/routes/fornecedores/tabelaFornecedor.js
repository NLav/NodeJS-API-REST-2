const modelo = require('./modeloTabela')

module.exports = {
    listar() {
        return modelo.findAll()
    }
}