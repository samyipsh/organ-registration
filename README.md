# organ-registration

Store organ registrations in the URL for easy dissemnination and storage. Visualize organ stops.

production site: https://samyipsh.github.io/organ-registration/
- example query param: `/?pedal=0011010000000&swell=0000000000001000000&great=01001000000000`

example of storage of 4 registrations: https://samyipsh.github.io/organ-registration/?options=1&registrations=M4-1:0:0001000000010011000100000000000001001000000000:Clarinet%20solo~M4-2:0:0001000000010011000001000000000001001000000000:Cor%20Anglais%20solo~:0:0000000000000000000000000000000000000000000000:~M4-4:0:1101000001110011000010111100000111001111000100:Stanza%204%20goes%20boom%20boom


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).



## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build

# preview locally
npm run preview
# `serve -s dist` wouldn't work 
# since base in vite.config is the github-repo name so that github-pages can deploy it properly

# deploy to production (gh-pages branch)
npm run deploy
```

Check other npm run commands in `package.json`

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).