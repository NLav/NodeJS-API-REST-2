const modeloFornecedores = require('../routes/fornecedores/modeloTabela')

modeloFornecedores.sync()
    .then(() => console.log('Tabela Fornecedores criada com sucesso'))
    .catch(console.log)