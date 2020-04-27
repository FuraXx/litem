const path      = require('path'); 
const fs        = require('fs');
const { spawn } = require('child_process');
const _msbuild  = require('msbuild');
const cpr       = require('cpr');
const cpx       = require('cpx');
const rimraf    = require('rimraf');

const BUILD_DEPS        = path.join(__dirname, '../build-deps').replace('/', '\\');
const PREMAKE           = path.join(BUILD_DEPS, './premake/premake5.exe').replace('/', '\\');
const BOOST_ROOT        = path.join(BUILD_DEPS, './boost', fs.readdirSync(path.join(BUILD_DEPS, './boost'))[0]).replace('/', '\\');
const CEF_ROOT          = path.join(BUILD_DEPS, './cef', fs.readdirSync(path.join(BUILD_DEPS, './cef'))[0]).replace('/', '\\');
const PREBUILD          = path.join(__dirname, '../litem-patch/prebuild.cmd').replace('/', '\\');
const SLN_CLIENT_FOLDER = path.join(__dirname, '../litem-patch/code/build/five').replace('/', '\\');
const SLN_SERVER_FOLDER = path.join(__dirname, '../litem-patch/code/build/server/windows').replace('/', '\\');
const SLN_CLIENT        = path.join(SLN_CLIENT_FOLDER, './CitizenMP.sln').replace('/', '\\');
const SLN_SERVER        = path.join(SLN_SERVER_FOLDER, './CitizenMP.sln').replace('/', '\\');

console.log('BUILD_DEPS        => ' + BUILD_DEPS);
console.log('PREMAKE           => ' + PREMAKE);
console.log('BOOST_ROOT        => ' + BOOST_ROOT);
console.log('CEF_ROOT          => ' + CEF_ROOT);
console.log('PREBUILD          => ' + PREBUILD);
console.log('SLN_CLIENT_FOLDER => ' + SLN_CLIENT_FOLDER);
console.log('SLN_SERVER_FOLDER => ' + SLN_SERVER_FOLDER);
console.log('SLN_CLIENT        => ' + SLN_CLIENT);
console.log('SLN_SERVER        => ' + SLN_SERVER);

const getopts = (cwd) => {

  const opts = {env: {}};

  opts.cwd            = cwd;
  opts.env.PATH       = `${process.env.PATH};${PREMAKE}`;
  opts.env.BOOST_ROOT = BOOST_ROOT;

  return opts;

};

const clean = () => {

  return new Promise((resolve, reject) => {

    rimraf(path.join(__dirname, '../litem-patch/code/bin/five/release/citizen/*'), (err) => {

      if(err)
        throw err;

      rimraf(path.join(__dirname, '../litem-patch/code/bin/server/windows/release/citizen/*'), (err) => {

        if(err)
          throw err;
    
        resolve();

      });

    });

  });

}

const prebuild = () => {

  return new Promise((resolve, reject) => {

    const prebuild = spawn(PREBUILD, getopts(path.join(__dirname, '../litem-patch')));

    prebuild.stdout.on('data', data => process.stdout.write(data.toString()));
    prebuild.stderr.on('data', data => process.stderr.write(data.toString()));

    prebuild.on('error', (err) => reject(err));

    prebuild.on('exit', (code) => {
      resolve();
    });

  });

}

const premake = (...args) => {
  
  return new Promise((resolve, reject) => {

    const prebuild = spawn(PREMAKE, args, getopts(path.join(__dirname, '../litem-patch/code')));

    prebuild.stdout.on('data', data => process.stdout.write(data.toString()));
    prebuild.stderr.on('data', data => process.stderr.write(data.toString()));

    prebuild.on('error', (err) => reject(err));

    prebuild.on('exit', (code) => {
      resolve();
    });

  });

}

const restorePackages = () => {

  return new Promise((resolve, reject) => {

    const restoreClient = spawn(path.join(__dirname, '../litem-patch/code/tools/ci/nuget.exe').replace('/', '\\'), ['restore', '.\\CitiMono.csproj', '-PackagesDirectory', '.'], {cwd: path.join(__dirname, '../litem-patch/code/build/five')});

    restoreClient.stdout.on('data', data => process.stdout.write(data.toString()));
    restoreClient.stderr.on('data', data => process.stderr.write(data.toString()));

    restoreClient.on('error', (err) => reject(err));

    restoreClient.on('exit', () => {

      const restoreServer = spawn(path.join(__dirname, '../litem-patch/code/tools/ci/nuget.exe').replace('/', '\\'), ['restore', '.\\CitiMono.csproj', '-PackagesDirectory', '.'], {cwd: path.join(__dirname, '../litem-patch/code/build/server/windows')});

      restoreServer.stdout.on('data', data => process.stdout.write(data.toString()));
      restoreServer.stderr.on('data', data => process.stderr.write(data.toString()));
    
      restoreServer.on('error', (err) => reject(err));
    
      restoreServer.on('exit', () => {
        
        resolve();

      });

    });

  });

}

const buildClient = () => {

  const cwd = process.cwd();

  process.chdir(SLN_CLIENT_FOLDER);

  return new Promise((resolve, reject) => {

    const msbuild = new _msbuild(() => {
      process.chdir(cwd);
      resolve();
    }); 

    msbuild.sourcePath = SLN_CLIENT;
    msbuild.config('version','16.0');
    msbuild.configuration = 'Release';
    msbuild.overrideParams.push('/m');
    msbuild.build();

  });

}

const buildServer = () => {

  const cwd = process.cwd();

  process.chdir(SLN_SERVER_FOLDER);

  return new Promise((resolve, reject) => {

    const msbuild = new _msbuild(() => {
      process.chdir(cwd);
      resolve();
    }); 

    msbuild.sourcePath = SLN_SERVER;
    msbuild.config('version','16.0');
    msbuild.configuration = 'Release';
    msbuild.overrideParams.push('/m');
    msbuild.build();

  });

}

const copyClientDeps = () => {

  return new Promise((resolve, reject) => {

    cpx.copy(path.join(__dirname, '../litem-patch/data/shared/**'), path.join(__dirname, '../litem-patch/code/bin/five/release'), (err, files) => {
      
      if(err)
        throw err;

        cpx.copy(path.join(__dirname, '../litem-patch/data/client/**'), path.join(__dirname, '../litem-patch/code/bin/five/release'), (err, files) => {
      
          if(err)
            throw err;

            cpx.copy(CEF_ROOT + '/Release/*', path.join(__dirname, '../litem-patch/code/bin/five/release/bin'), (err, files) => {

              if(err)
                throw err;

                cpx.copy(CEF_ROOT + '/Resources/*.pak', path.join(__dirname, '../litem-patch/code/bin/five/release/bin/cef'), (err, files) => {

                  if(err)
                    throw err;

                    cpx.copy(CEF_ROOT + '/Resources/locales/en-US.pak', path.join(__dirname, '../litem-patch/code/bin/five/release/bin/cef'), (err, files) => {

                      if(err)
                        throw err;
        
                        cpx.copy(CEF_ROOT + '/Resources/*.dat', path.join(__dirname, '../litem-patch/code/bin/five/release/bin'), (err, files) => {

                          if(err)
                            throw err;
                            
                          resolve();

                        });
        
                    });
    
                });

              resolve();

            });

        });

    });

  });

}

const copyServerDeps = () => {

  return new Promise((resolve, reject) => {

    cpx.copy(path.join(__dirname, '../litem-patch/data/shared/**/*'), path.join(__dirname, '../litem-patch/code/bin/server/windows/release'), (err, files) => {
  
      if(err)
        throw err;

        cpx.copy(path.join(__dirname, '../litem-patch/data/server/**'), path.join(__dirname, '../litem-patch/code/bin/server/windows/release'), (err, files) => {
      
          if(err)
            throw err;

            cpx.copy(path.join(__dirname, '../litem-patch/data/server_windows/**'), path.join(__dirname, '../litem-patch/code/bin/server/windows/release'), {overwrite: true}, (err, files) => {
      
              if(err)
                throw err;
    
              resolve();
    
            });

        });

    });

  });

}

const copyServerBins = () => {

  return new Promise((resolve, reject) => {

    cpx.copy(path.join(__dirname, '../litem-patch/code/bin/five/release/v8*'), path.join(__dirname, '../litem-patch/code/bin/server/windows/release'), (err) => {
  
      if(err)
        throw err;

        cpx.copy(path.join(__dirname, '../litem-patch/code/bin/five/release/bin/icu*'), path.join(__dirname, '../litem-patch/code/bin/server/windows/release'), (err) => {
  
          if(err)
            throw err;

          resolve();
    
        });
    

    });

  });

}

(async() => {

  await clean();
  await prebuild();
  await premake('vs2019', '--game=five');
  await premake('vs2019', '--game=server');
  await restorePackages();
  await copyClientDeps();
  await copyServerDeps();
  await buildClient();
  await buildServer();
  await copyServerBins();

})();