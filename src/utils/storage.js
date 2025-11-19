const fs = require('fs');
const path = require('path');

const storage = {
  saveFile: (filePath, data) => {
    fs.writeFileSync(path.resolve(__dirname, filePath), data);
  },
  readFile: (filePath) => {
    return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
  },
};

module.exports = storage;
