const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexFile = require('../knexfile');

// TODO Criar chaveamento dinamaiso
app.db = knex(knexFile.test);

consign({ cwd: 'src', verbose: false }) // Seta o src como diretorio padrão para facilitar a busca do arquivo middlewares.js
  .include('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/routes.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

// app.db.on('query', (query) => {
//   console.log({ sql: query.sql, bindings: query.bindings ? query.bindings.join(',') : '' });
// }).on('query-response', (response) => {
//   console.log(response);
// }).on('error', (error) => console.log(error));

module.exports = app;
