const modelo = require('./modeloTabela')
const NaoEncontrado = require('../../errors/NaoEncontrado')

module.exports = {
    listar() {
        return modelo.findAll({ raw: true })
    },

    async listarId(id) {
        const resultado = await modelo.findOne({
            where: {
                id: id
            }
        })

        if (!resultado) {
            throw new NaoEncontrado()
        }

        return resultado
    },

    inserir(fornecedor) {
        return modelo.create(fornecedor)
    },

    atualizar(id, dados) {
        return modelo.update(
            dados,
            {
                where: { id: id }
            }
        )
    },

    remover(id) {
        modelo.destroy({
            where: { id: id }
        })
    }
}