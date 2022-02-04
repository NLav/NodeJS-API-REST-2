const ValorNaoSuportado = require('./errors/ValorNaoSuportado')
const jsontoxml = require('jsontoxml')

class Serializador {
    json(dados) {
        return JSON.stringify(dados)
    }

    xml(dados) {
        let tag = this.tagSingular

        if (Array.isArray(dados)) {
            tag = this.tagPlural
            dados = dados.map((dado) => {
                return {
                    [this.tagSingular]: dado
                }
            })
        }
        return jsontoxml({ [tag]: dados })
    }

    serializar(dados) {
        dados = this.filtrar(dados)
        if (this.contentType === 'application/json') {
            return this.json(dados)
        }

        if (this.contentType === 'application/xml') {
            return this.xml(dados)
        }

        throw new ValorNaoSuportado(this.contentType)
    }

    filtrarObjeto(dados) {
        const objeto = {}

        this.camposPublicos.forEach((campo) => {
            if (dados.hasOwnProperty(campo)) {
                objeto[campo] = dados[campo]
            }
        })
        return objeto
    }

    filtrar(dados) {
        if (Array.isArray(dados)) {
            dados = dados.map((dado) => {
                return this.filtrarObjeto(dado)
            })
        } else {
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }
}

class SerializadorFornecedor extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'empresa', 'categoria']
            .concat(camposExtras || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializadorErro extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['idErro', 'mensagem']
            .concat(camposExtras || [])
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    formatosAceitos: ['application/json', 'application/xml']
}