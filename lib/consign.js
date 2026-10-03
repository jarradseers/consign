/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

// Module dependencies.

const fs = require('fs');
const path = require('path');
const pack = require('../package');

// File extensions that are loaded unless more are added.

const extensions = ['.js', '.json', '.node'];

/**
 * Is the function an ES6 class, which has to be called with `new`.
 *
 * @param fn
 * @returns {boolean}
 */

function isClass(fn) {
  return /^class[\s{]/.test(Function.prototype.toString.call(fn));
}

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
    ignore: null,
    loggingType: 'info'
  };

  this._files = [];
  this._lastOperation = 'include';

  for (const o in options) {
    this._options[o] = options[o];
  }

  this._options.extensions = extensions.concat(options.extensions || []);
  this._cwd = path.resolve(this._options.cwd);
  this._ = require(path.join(__dirname, '..', 'locale', this._options.locale));

  this._log([pack.name, 'v' + pack.version, this._t('Initialized in'), this._options.cwd]);

  return this;
}

/**
 * Set locations.
 *
 * @param parent
 * @param entity
 * @param push
 * @returns
 */

Consign.prototype._setLocations = function(parent, entity, push) {
  if (!entity) {
    this._log(['!', this._t('Entity not found'), parent], 'error');
    return this;
  }

  const parts = entity.split(/\s?,\s?/g);

  if (parts.length > 1) {
    for (const part of parts) {
      this._setLocations(parent, part, push);
    }
    return this;
  }

  const location = path.resolve(path.join(parent, entity));

  if (!fs.existsSync(location)) {
    this._log(['!', this._t('Entity not found'), location], 'error');
    return this;
  }

  if (push && this._isIgnored(location)) {
    this._log(['!', this._t('Ignoring file'), ':', this._getRelativeTo(location)]);
    return this;
  }

  if (fs.statSync(location).isDirectory()) {
    for (const child of fs.readdirSync(location)) {
      if ('.' === child.charAt(0)) {
        this._log([
          '!', this._t('Ignoring hidden entity'), path.join(location, child)
        ], 'warn');
      } else {
        this._setLocations(location, child, push);
      }
    }

    return this;
  }

  const extension = path.extname(location);

  if (this._options.extensions.indexOf(extension.toLowerCase()) === -1) {
    this._log(['!', this._t('Ignoring extension'), ':', extension]);
    return this;
  }

  const index = this._files.indexOf(location);

  if (push && index === -1) {
    this._files.push(location);
    this._log(['+', this._getRelativeTo(location)], 'log');
  } else if (!push && index !== -1) {
    this._files.splice(index, 1);
    this._log(['-', this._getRelativeTo(location)], 'log');
  }

  return this;
};

/**
 * Should the location be left out, according to the `ignore` option.
 *
 * @param location
 * @returns {boolean}
 */

Consign.prototype._isIgnored = function(location) {
  const ignore = this._options.ignore;
  const relative = path.relative(this._cwd, location).split(path.sep).join('/');

  if (ignore instanceof RegExp) {
    ignore.lastIndex = 0;
    return ignore.test(relative);
  }

  return typeof ignore === 'function' ? Boolean(ignore(relative)) : false;
};

/**
 * Get relative to location.
 *
 * @param location
 * @returns
 */

Consign.prototype._getRelativeTo = function(location) {
  return '.' + path.sep + path.relative(this._cwd, location);
};

/**
 * Create namespace.
 *
 * @param parent
 * @param parts
 * @param mod
 * @returns
 */

Consign.prototype._createNamespace = function(parent, parts, mod) {
  const part = parts.shift();

  if (!parts.length) {
    parent[this._getKeyName(part)] = mod;
    return parent;
  }

  if (!parent[part]) {
    parent[part] = {};
  }

  return this._createNamespace(parent[part], parts, mod);
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
 * Translate a logging string, falling back to the string itself.
 *
 * @param string
 * @returns
 */

Consign.prototype._t = function(string) {
  return this._[string] || string;
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

Consign.prototype.into = function(object, ...rest) {
  const args = [object].concat(rest);

  for (const script of this._files) {
    delete require.cache[script];

    const parts = path.relative(this._cwd, script).split(path.sep).filter(function(part) {
      return part !== '..';
    });

    let mod;

    try {
      mod = require(script);
    } catch(err) {
      const error = new Error('Failed to require: ' + script + ', because: ' + err.message);
      error.cause = err;
      throw error;
    }

    // Handle ES6 default exports (ie. named export called default)
    if (mod && mod.default) {
      mod = mod.default;
    }

    if ('function' === typeof mod) {
      mod = isClass(mod) ? new mod(...args) : mod.apply(mod, args);
    }

    this._createNamespace(object, parts, mod);
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
