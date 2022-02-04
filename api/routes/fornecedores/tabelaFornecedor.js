const modelo = require('./modeloTabela')

module.exports = {
    listar() {
        return modelo.findAll()
    },

    async listarId(id) {
        const resultado = await modelo.findOne({
            where: {
                id: id
            }
        })

        if (!resultado) {
            throw new Error('Fornecedor não encontrado')
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
    }
}