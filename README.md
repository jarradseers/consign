# Consign

[![CI](https://github.com/jarradseers/consign/actions/workflows/ci.yml/badge.svg)](https://github.com/jarradseers/consign/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/consign.svg)](https://www.npmjs.com/package/consign)

Autoload your scripts! _The successor to `express-load`._

Consign makes applications easier to develop with logical file separation and automatic script loading. Use it to autoload models, routes, schemas, configs, controllers, object maps and so on. It has no dependencies.

If you are writing scripts and just need some structure, see [middleware-chain](https://github.com/jarradseers/middleware-chain); there is an example of the two together in the [examples](examples) folder.

## Installation

```bash
$ npm install consign
```

## Usage

```js
const consign = require('consign');

const app = {};

consign()
  .include('models')
  .then('controllers')
  .into(app);

// app.models.user
// app.models.company
// app.controllers.user
// app.controllers.company
```

Each file is loaded with `require` and placed on the object under its path: `models/user.js` becomes `app.models.user`. Files are loaded in the order they were included, and files within a directory in alphabetical order.

There are more in the [examples](examples) and [test](test) folders.

## API

| Method | Description |
|---|---|
| `consign(options)` | Create a loader. See [Options](#options). |
| `.include(entity)` | Add a file or directory, relative to `cwd`. Directories are added recursively. Several can be given in one string, separated by commas: `'models, controllers'`. |
| `.exclude(entity)` | Remove a file or directory that was included. |
| `.then(entity)` | Repeat the last operation, `include` or `exclude`, with another entity. |
| `.into(object, ...args)` | Load the files onto the object. |

All of them return the loader, so calls can be chained.

To load one file before the rest of its directory, include it first; a file is only added once:

```js
consign()
  .include('models/base.js, models')
  .into(app);
```

## What a script can export

| Export | Result |
|---|---|
| A function | Called with the arguments given to `into`, so `into(app)` calls it with `app`. Its return value is stored. |
| A class | Constructed with the same arguments. The instance is stored. |
| Anything else | Stored as it is, including the contents of a `.json` file. |

A transpiled module with a `default` export is treated as its default export.

```js
// models/user.js
module.exports = function(app) {
  return {
    find: function() { /* ... */ }
  };
};
```

## Options

The optional options object is passed to the main `consign` function. These are the defaults:

```js
consign({
  cwd: process.cwd(),
  locale: 'en-us',
  logger: console,
  verbose: true,
  extensions: ['.js', '.json', '.node'],
  ignore: null,
  loggingType: 'info'
});
```

### Base directory (cwd)

Consign uses paths relative to your current working directory. When you do not want a parent directory in the object chain, set `cwd`:

```js
consign()
  .include('app') // ./app/controllers/user.js
  .into(app);

// app.app.controllers.user
```

```js
consign({cwd: 'app'})
  .include('controllers') // ./app/controllers/user.js
  .into(app);

// app.controllers.user
```

### File extensions

Only files ending in `.js`, `.json` or `.node` are loaded. Anything you pass in `extensions` is added to that list; it does not replace it:

```js
consign({extensions: ['.cjs']});
```

Hidden files and directories, those starting with a dot, are always skipped.

### Ignoring files

`ignore` leaves files and directories out of an `include`. It is a regular expression, or a function returning `true` to ignore, tested against each path relative to `cwd`, with forward slashes:

```js
consign({ignore: /\.test\.js$|__mocks__/})
  .include('controllers')
  .into(app);
```

### Logging

| Option | Description |
|---|---|
| `verbose` | On by default; set to `false` for no logging. |
| `logger` | Defaults to `console`. Any object with `info`, `log`, `warn` and `error` methods. |
| `loggingType` | The logger method used for general messages; defaults to `info`. |
| `locale` | Language of the log messages: `en-au`, `en-nz`, `en-us`, `fr-fr`, `pl`, `pt-br` or `zh-cn`. |

## Errors

An entity that does not exist is logged and skipped. A file that fails to load makes `into` throw an `Error` naming the file, with the original error as its `cause`.

## Upgrading from 0.1.x

- Only `.js`, `.json` and `.node` files are loaded, as documented. In 0.1.x the list was not applied, so every file in an included directory was loaded, including editor backups such as `user.js~`. Add other extensions with the `extensions` option.
- A module that exports a class is constructed rather than called.
- A failed load throws an `Error` instead of a string.
- Excluding a file that was not included no longer removes a different file.
- A `cwd` whose name appears again later in a path no longer breaks the keys.

## Tests

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE)
