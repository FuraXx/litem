const path     = require('path');
const fs       = require('fs');
const { add }  = require('node-7z');
const sevenBin = require('7zip-bin');

const prepublish = () => {

  return new Promise(async (resolve, reject) => {

    const userName = await require('git-username')();
    const repoName = await require('git-repo-name')();

    fs.writeFile(path.join(__dirname, '../dist/client/LiteM.ini'), `[update]
repo=${userName}/${repoName}
`, (err) => {

      if(err) {

        reject();

      } else {

        const clientStream = add(path.join(__dirname, '../dist/FiveM-client.zip'), path.join(__dirname, '../dist/client/*'), {$bin: sevenBin.path7za, recursive: true});

        clientStream.on('end', () => {

          const serverStream = add(path.join(__dirname, '../dist/FiveM-server.zip'), path.join(__dirname, '../dist/server/*'), {$bin: sevenBin.path7za, recursive: true});
      
          serverStream.on('end', resolve);

        });

      };

    });

  });

}

(async() => {

  await prepublish();

})();