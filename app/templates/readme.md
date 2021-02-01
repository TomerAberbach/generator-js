<h1 align="center">
  <%= unscopedModuleName %>
</h1>

<div align="center">
  <a href="https://npmjs.org/package/<%= moduleName %>">
    <img src="https://badgen.now.sh/npm/v/<%= moduleName %>" alt="version" />
  </a>
  <a href="https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/actions">
    <img src="https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://bundlephobia.com/result?p=<%= moduleName %>">
    <img src="https://badgen.net/bundlephobia/minzip/<%= moduleName %>" alt="minzipped size" />
  </a>
</div>

<div align="center">
  <%= moduleDescription %>
</div>

## Features

- **Wow:** so amazing
- **Amazing:** so wow 
- **Fancy:** has a tie and everything

## Install

```sh
$ npm i <%= moduleName %>
```

## Usage

```js
import <%= camelCasedModuleName %> from '<%= moduleName %>'

console.log(<%= camelCasedModuleName %>())
//=> Hello World!
```

## Contributing

Stars are always welcome!

For bugs and feature requests, [please create an issue](https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/issues/new).

## License

[<%= licenseName %>](https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/blob/main/license) © [<%= name %>](https://github.com/<%= githubUsername %>)
