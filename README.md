# Consign

[![Build Status](https://travis-ci.org/jarradseers/consign.svg?branch=develop)](https://travis-ci.org/jarradseers/consign)

  Autoload your scripts! _the successor to `express-load`_

  Consign makes applications easier to develop with logical file separation and automatic script loading.

  Consign can be used to autoload models, routes, schemas, configs, controllers, object maps... etc...

  Also if you are writing scripts and just need to add some structure, check out (middleware-chain)[https://github.com/jarradseers/middleware-chain], there is a new example for this usage in the [examples](examples) folder.

## Usage

```js
var consign = require('consign');

consign()
  .include('models')
  .then('controllers')
  .into(app);

// app.models.user
// app.models.company
// app.controllers.user
// app.controllers.company
```

Check out the [examples](examples) or [test folder](test) for more!

## Installation

```bash
$ npm install consign
```

## Features

  * Autoload scripts
  * Supports order, includes and excludes
  * Made to supplement frameworks or scripts
  * Makes MVC applications easier to work with
  * Test driven
  * Fast, Light-weight with no external dependencies
  * Highly configurable

## Options

  The optional options object is passed in as a parameter to the main `consign` function.

#### Defaults
  ```js
    consign({
      cwd: process.cwd(),
      locale: 'en-us',
      logger: console,
      verbose: true,
      extensions: [ '.js', '.json', '.node' ],
      loggingType: 'info'
    })
  ```

### Logging

  `logger` - Defaults to console, this can be switched out.
  `verbose` - On by default, set to `false` for no logging
  `loggingType` - Set the type of logging, defaults to `info`

### Locale

Current supported locale (for logging output):

  - en-au
  - en-nz
  - en-us
  - fr-fr
  - pt-br
  - pl
  - zh-cn

### Base Directory (cwd)

  Consign will simply use a relative path from your current working directory, however sometimes you don't want heavily nested files included in the object chain, so you can set the cwd:

  ```js
  consign()
    .include('app') // ./app/controllers/user.js
    .into(app);
  ```

  would result in:

  ```js
  app.app.controllers.user
  ```

  so using the `cwd` option:

  ```js
  consign({cwd: 'app'})
    .include('app') // ./app/controllers/user.js
    .into(app);
  ```
  would give us:

  ```js
  app.controllers.user
  ```

### File Extensions

  Defaults to an array containing `.js`, .`json` and `.node`, new ones are concatenated instead of replaced.

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

  ```bash
  $ npm install
  $ npm test
  ```

## License

  [MIT](LICENSE)
