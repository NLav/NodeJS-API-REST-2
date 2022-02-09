const modelo = require('./modelo')
const instancia = require('../../database')
const NaoEncontrado = require('../../errors/NaoEncontrado')

module.exports = {
    inserir(dados) {
        return modelo.create(dados)
    },

    listar(idFornecedor) {
        return modelo.findAll({
            where: { fornecedor: idFornecedor },
            raw: true
        })
    },

    async listarId(idProduto, idFornecedor) {
        const resultado = await modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })

        if (!resultado) {
            throw new NaoEncontrado('Produto')
        }

        return resultado
    },

    atualizar(idProduto, idFornecedor, dados) {
        return modelo.update(
            dados,
            {
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            }
        )
    },

    atualizarCampo(idProduto, idFornecedor, campo, valorCampo) {
        return instancia.transaction(async (transacao) => {
            const produto = await modelo.findOne({
                where: { id: idProduto, fornecedor: idFornecedor }
            })

            produto[campo] = valorCampo

            await produto.save()

            return produto
        })
    },

    deletar(idProduto, idFornecedor) {
        return modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    }
}