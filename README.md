# LiteM

## for the lazy ➡️ https://github.com/hatixbinaries/litem/releases/latest

LiteM helps you create a FiveM version not relying on FiveM services.

## ⬇️ for the brave ⬇️

# Installation

- Download and install [Python2.7](https://www.python.org/downloads/release/python-2718/)
- Download and install [NodeJS](https://nodejs.org/dist/v12.16.2/node-v12.16.2-x64.msi)
- Download and install [Visual Studio 2019](https://visualstudio.microsoft.com/vs/)
- Download and install [MSYS2](http://repo.msys2.org/distrib/x86_64/msys2-x86_64-20190524.exe) and install to c:\msys64
- Make sur these are checked [screenshot](https://i.imgur.com/ZYZb9Na.png)

```bash
# First install
git clone https://github.com/esx-org/litem
cd litem
git submodule init
git submodule update
npm install
npm run init # will take a while
npm run apply-diff
npm run deps
npm run build-ui # build html stuff for nui
npm run build # if fails open both CitizenMP.sln, install v142 if asking for and restore nuget packages  
npm run dist
npm run litem # with commandline, just for the fun

# When you want to update
npm run update

# When you want to save your changes in diff
npm run create-diff

# Want to release a ToS-compliant modification ?
npm run prepublish
```

Mandatory thing **sv_lan 1**

Everything in **dist/** folder

# State of the projet
- Unfinished, still bloated in many parts
- Will probably never touch this again but will be happy to merge contributions if any

# Alternatives

- [alt:V](https://altv.mp)
- [LS:MP](https://los-santos-multiplayer.com)

# Credits
cfx.re collective https://forum.cfx.re
