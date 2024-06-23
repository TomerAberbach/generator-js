<h1 align="center">
  <%= unscopedModuleName %>
</h1>

<div align="center">
  <a href="https://npmjs.org/package/<%= moduleName %>">
    <img src="https://badgen.net/npm/v/<%= moduleName %>" alt="version" />
  </a>
  <a href="https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/actions">
    <img src="https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://unpkg.com/<%= moduleName %>/dist/<%= entryName %>.js">
    <img src="https://deno.bundlejs.com/?q=<%= moduleName %>&badge" alt="gzip size" />
  </a>
  <a href="https://unpkg.com/<%= moduleName %>/dist/<%= entryName %>.js">
    <img src="https://deno.bundlejs.com/?q=<%= moduleName %>&config={%22compression%22:{%22type%22:%22brotli%22}}&badge" alt="brotli size" />
  </a>
  <a href="https://github.com/sponsors/<%= githubUsername %>">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor">
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

For bugs and feature requests, [please create an issue](https://github.com/<%=
githubUsername %>/<%= unscopedModuleName %>/issues/new).
<% if (isGoogle) { %>
For pull requests, please read the
[contributing guidelines](https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/blob/main/contributing.md).
<% } %>

## License
<% if (isGoogle) { %>
[Apache License 2.0](https://github.com/<%= githubUsername %>/<%= unscopedModuleName %>/blob/main/license)

This is not an official Google product.
<% } else { %>
[<%= licenseName %>](https://github.com/<%= githubUsername %>/<%=
unscopedModuleName %>/blob/main/license) © [<%= name %>](https://github.com/<%=
githubUsername %>)
<% } %>
