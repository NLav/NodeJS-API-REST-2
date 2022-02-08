const modelos = [
    require('../routes/fornecedores/modelo'),
    require('../routes//produtos/modelo')
]

async function criarTabelas() {
    for (let i = 0; i < modelos.length; i++) {
        const modelo = modelos[i]
        await modelo.sync()
    }
}

criarTabelas()