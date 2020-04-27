# LiteM

LiteM helps you create a FiveM version not relying on FiveM services.

We (and you btw) cannot distribute modified binaries who do such thing so we'd make it easy for you to generate them.

Each LiteM user SHOULD compile the source by themselves to comply with FiveM ToS

# Installation

- Download and install [NodeJS](https://nodejs.org/dist/v12.16.2/node-v12.16.2-x64.msi)
- Download and install [Visual Studio 2019](hhttps://visualstudio.microsoft.com/fr/thank-you-downloading-visual-studio/?sku=Community&rel=16)
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
npm run build
npm run dist
npm run litem # with commandline, just for the fun

# When you want to update
npm run update

# When you want to save your changes in diff
npm run create-diff
```

Mandatory thing **sv_lan 1**

Everything in **dist/** folder

# State of the projet
- Unfinished, still bloated in many parts
- Will probably never touch this again but will be happy to merge contributions if any

# Alternatives

- [alt:V](https://altv.mp)
- [LS:MP](https://los-santos-multiplayer.com)
