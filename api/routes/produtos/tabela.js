const modelo = require('./modelo')

module.exports = {
    listar(fornecedor) {
        return modelo.findAll({
            where: { fornecedor: fornecedor }
        })
    },

    inserir(dados) {
        return modelo.create(dados)
    },

    deletar(fornecedor, idProduto) {
        return modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: fornecedor
            }
        })
    }
}