<h1 align="center">
  <%= unscopedModuleName %>
</h1>

<div align="center">
  <a href="https://npmjs.org/package/<%= moduleName %>">
    <img src="https://badgen.net/npm/v/<%= moduleName %>" alt="version" />
  </a>
  <a href="https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/actions/workflows/ci.yml">
    <img src="https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" />
  </a><% if (hasLib) { %>
  <a href="https://unpkg.com/<%= moduleName %>/dist/index.js">
    <img src="https://deno.bundlejs.com/?q=<%= moduleName %>&badge" alt="gzip size" />
  </a>
  <a href="https://unpkg.com/<%= moduleName %>/dist/index.js">
    <img src="https://deno.bundlejs.com/?q=<%= moduleName %>&config={%22compression%22:{%22type%22:%22brotli%22}}&badge" alt="brotli size" />
  </a><% } %>
  <a href="https://github.com/sponsors/<%= githubUsername %>">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor" />
  </a>
</div>

<div align="center">
  <%= moduleDescription %>
</div>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#install">Install</a> •
  <a href="#usage">Usage</a>
</div>

## Features

- **Wow:** so amazing
- **Amazing:** so wow
- **Fancy:** has a tie and everything

## Install

```sh
<% if (hasCli) { %>$ npm i -g <%= moduleName %>
<% } %><% if (hasCli && hasLib) { %>
# Or as a dependency
<% } %><% if (hasLib) { %>$ npm i <%= moduleName %>
<% } %>```
<% if (hasCli) { %>
<details>
<summary>Shell completions (optional)</summary>

```sh
# Bash (Linux)
$ <%= unscopedModuleName %> --completion bash > ~/.local/share/bash-completion/completions/<%= unscopedModuleName %>

# Bash (macOS/Homebrew)
$ <%= unscopedModuleName %> --completion bash > $(brew --prefix)/etc/bash_completion.d/<%= unscopedModuleName %>

# Fish
$ <%= unscopedModuleName %> --completion fish > ~/.config/fish/completions/<%= unscopedModuleName %>.fish

# Zsh
$ <%= unscopedModuleName %> --completion zsh > ~/.zfunc/_<%= unscopedModuleName %>

# PowerShell
$ <%= unscopedModuleName %> --completion pwsh >> $PROFILE.CurrentUserCurrentHost
```

</details>
<% } %>
## Usage
<% if (hasCli) { %><% if (hasLib) { %>
### CLI
<% } %>
```sh
$ <%= unscopedModuleName %>
Hello World!

$ <%= unscopedModuleName %> <%= name.split(' ')[0] %>
Hello <%= name.split(' ')[0] %>!
```
<% } %><% if (hasLib) { %><% if (hasCli) { %>
### API
<% } %>
```js
import <%= camelCasedModuleName %> from '<%= moduleName %>'

console.log(<%= camelCasedModuleName %>())
//=> Hello World!
```
<% } %>
## Contributing

Stars are always welcome!

For bugs and feature requests, [create an issue](https://github.com/<%=
githubUsername %>/<%= unscopedModuleName %>/issues/new).

## License

[MIT](https://github.com/<%= githubUsername %>/<%=
unscopedModuleName %>/blob/main/license) © [<%= name %>](https://github.com/<%=
githubUsername %>)
