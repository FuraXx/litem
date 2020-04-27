const path            = require('path');
const fs              = require('fs');
const wget            = require('node-wget-promise');
const { extractFull } = require('node-7z');
const sevenBin        = require('7zip-bin');
const cpr             = require('cpr');

const BUILD_DEPS = path.join(__dirname, '../build-deps').replace('/', '\\');

const parseDeps = () => {
  
  const deps = {};
  const md   = fs.readFileSync(path.join(__dirname, '../fivem/docs/building.md')).toString();

  deps.premake5 = 'https://github.com/premake/premake-core/releases/download/v5.0.0-alpha15/premake-5.0.0-alpha15-windows.zip'
  deps.boost    = md.match(/https:\/\/.*boost.*\.7z/)[0];
  deps.cef      = md.match(/https:\/\/.*cef_binary_.*\.zip/)[0];

  return deps;
}

(async() => {

  const deps = parseDeps();

  console.log('downloading premake');
  await wget(deps.premake5, {output: path.join(__dirname, '../build-deps/premake.zip')});
  
  console.log('extracting premake');
  const extractPremake = extractFull(path.join(__dirname, '../build-deps/premake.zip'), path.join(__dirname, '../build-deps/premake'), {$bin: sevenBin.path7za});

  extractPremake.on('end', async () => {

    console.log('downloading boost');
    await wget(deps.boost, {output: path.join(__dirname, '../build-deps/boost.7z')});
    
    console.log('extracting boost')
    const extractBoost = extractFull(path.join(__dirname, '../build-deps/boost.7z'), path.join(__dirname, '../build-deps/boost'), {$bin: sevenBin.path7za})
  
    extractBoost.on('end', async () => {

      console.log('downloading modified cef');
      await wget(deps.cef, {output: path.join(__dirname, '../build-deps/cef.zip')});

      console.log('extracting modified cef')
      const extractCEF = extractFull(path.join(__dirname, '../build-deps/cef.zip'), path.join(__dirname, '../build-deps/cef'), {$bin: sevenBin.path7za})
    
      extractCEF.on('end', async () => {

        const CEF_ROOT = path.join(BUILD_DEPS, './cef/' + fs.readdirSync(path.join(BUILD_DEPS, './cef'))[0]);
        const CEF_DEST = path.join(__dirname, '../litem-patch/vendor/cef');

        console.log(CEF_ROOT);

        cpr(CEF_ROOT, CEF_DEST, {overwrite: true}, (err, files) => {

          if(err)
            throw err;

            console.log('done');

        });
      
      });

    });
  
  });

})();