/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

// Module dependencies.

var fs = require('fs')
  , util = require('util')
  , path = require('path')
  , pack = require(path.join(__dirname, '..', 'package'))
;

/**
 * Consign constructor.
 *
 * @param options
 * @returns
 */

function Consign(options) {
  options = options || {};

  this._options = {
    cwd: process.cwd(),
    locale: 'en-us',
    logger: console,
    verbose: true,
    extensions: [],
    loggingType: 'info'
  };

  this._files = [];
  this._object = {};
  this._extensions = this._options.extensions;
  this._lastOperation = 'include';

  for (var e in require.extensions) {
    this._extensions.push(e);
  }

  if (options.extensions) {
    this._extensions.concat(options.extensions);
  }

  for (var o in options) {
    this._options[o] = options[o];
  }

  this._ = require(path.join(__dirname, '..', 'locale', this._options.locale));

  this._log([pack.name, 'v' + pack.version, this._['Initialized in'], this._options.cwd]);

  return this;
}

/**
 * Set locations.
 *
 * @param parent
 * @param entity
 * @param push
 */

Consign.prototype._setLocations = function(parent, entity, push) {
  var parts = entity.split(/\s?,\s?/g);

  if (parts.length > 1) {
    for (var p in parts) {
      this._setLocations(parent, parts[p], true);
    }
    return this;
  }

  var location = path.resolve(path.join(parent, entity));

  if (!fs.existsSync(location)) {
    this._log(['!', this._['Entity not found'], location], 'error');
    return this;
  }

  if (fs.statSync(location).isDirectory()) {
    var dir = fs.readdirSync(location);

    for (var e in dir) {
      if ('.' === dir[e].charAt(0)) {
        this._log([
          '!', this._['Ignoring hidden entity'], path.join(location, dir[e])
        ], 'warn');
      } else {
        this._setLocations(location, dir[e], push);
      }
    }

    return this;
  }

  var regex = new RegExp(this._options.extensions.join('$|'), 'gi')
    , extension = path.extname(location)
  ;

  if (!regex.test(extension)) {
    this._log(['!', this._['Ignoring extension'], ':', extension]);
    return this;
  }

  if (push && this._files.indexOf(location) === -1) {
    this._files.push(location);
    this._log(['+', this._getRelativeTo(location)], 'log');
  } else if (!push) {
    this._files.splice(this._files.indexOf(location), 1);
    this._log(['-', this._getRelativeTo(location)], 'log');
  }

  return this;
};

/**
 * Get relative to location.
 *
 * @param location
 * @returns
 */

Consign.prototype._getRelativeTo = function(location) {
  return '.' + location.split(this._options.cwd, 2)[1];
};

/**
 * Create namespace.
 *
 * @param parent
 * @param parts
 * @returns
 */

Consign.prototype._createNamespace = function(parent, parts, mod) {
  var part = parts.shift();

  if (!parent[part]) {
    parent[this._getKeyName(part)] = parts.length ? {} : mod;
  }

  if (parts.length) {
    parent = this._createNamespace(parent[part], parts, mod);
  }

  return parent;
};

/**
 * Get key name.
 *
 * @param name
 * @returns
 */

Consign.prototype._getKeyName = function(name) {
  return path.basename(name, path.extname(name));
};

/**
 * Log handler.
 *
 * @param message
 * @param type
 * @returns
 */

Consign.prototype._log = function(message, type) {
  if (this._options.verbose) {
    this._options.logger[type || this._options.loggingType](message.join(' '));
  }

  return this;
};

/**
 * Include method.
 *
 * @param entity
 * @returns
 */

Consign.prototype.include = function(entity) {
  this._lastOperation = 'include';
  return this._setLocations(this._options.cwd, entity, true);
};

/**
 * Exclude method.
 *
 * @param entity
 * @returns
 */

Consign.prototype.exclude = function(entity) {
  this._lastOperation = 'exclude';
  return this._setLocations(this._options.cwd, entity, false);
};

/**
 * Then method.
 *
 * @param entity
 * @returns
 */

Consign.prototype.then = function(entity) {
  this[this._lastOperation].call(this, entity);
  return this;
};

/**
 * Into method.
 *
 * @param object
 * @returns
 */

Consign.prototype.into = function(object) {
  for (var f in this._files) {
    delete require.cache[this._files[f]];

    var script = this._files[f]
      , parts = this._getRelativeTo(script).split(path.sep).slice(1)
      , args = []
      , mod = require(script)
    ;

    for (var a in arguments) {
      args.push(arguments[a]);
    }

    if ('function' === typeof mod) {
      mod = mod.apply(mod, args);
    }

    var ns = this._createNamespace(object, parts, mod);
  }


  return this;
};

/**
 * Export Consign instance.
 *
 * @param options
 * @returns
 */

module.exports = function(options) {
  return new Consign(options);
};