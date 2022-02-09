const modelo = require('./modelo')
const NaoEncontrado = require('../../errors/NaoEncontrado')

module.exports = {
    inserir(fornecedor) {
        return modelo.create(fornecedor)
    },

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
            throw new NaoEncontrado('Fornecedor')
        }

        return resultado
    },

    atualizar(id, dados) {
        return modelo.update(
            dados,
            {
                where: { id: id }
            }
        )
    },

    deletar(id) {
        modelo.destroy({
            where: { id: id }
        })
    }
}