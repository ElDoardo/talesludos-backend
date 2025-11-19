const fs = require('fs-extra');
const path = require('path');

const source = path.join(__dirname, '../../storage/games');
const destination = path.join(__dirname, '../../storage/base/Game1');

fs.ensureDir(destination)
  .then(() => fs.copy(source, destination))
  .then(() => console.log('Arquivos base copiados com sucesso!'))
  .catch(err => console.error('Erro ao copiar arquivos:', err));