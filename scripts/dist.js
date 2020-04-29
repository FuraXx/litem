const path     = require('path');
const fs       = require('fs');
const wget     = require('node-wget-promise');
const { add }  = require('node-7z');
const sevenBin = require('7zip-bin');
const cpx      = require('cpx');

const copyFiles = () => {

  return new Promise((resolve, reject) => {

    cpx.copy(path.join(__dirname, '../litem-patch/code/bin/five/release') + '/**/*.!(pdb|lib|exp|obj|log)', path.join(__dirname, '../dist/client'), (err) => {
      
      if(err)
        throw err;

        cpx.copy(path.join(__dirname, '../litem-patch/code/bin/server/windows/release') + '/**/*.!(pdb|lib|exp|obj|log)', path.join(__dirname, '../dist/server'), (err) => {
      
          if(err)
            throw err;

          resolve();
    
        });
    });

  });


}

(async() => {

  await copyFiles();

})();