/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

// Module dependencies.
const { it } = require('node:test');
const path = require('path');

module.exports = function(consign, assert) {

  // Test setup.
  const cwd = path.resolve('test/test-app/controllers');
  const verbose = false;

  it('Should set verbose to false', function() {
    const instance = consign({verbose: false});
    assert.equal(false, instance._options.verbose);
  });

  it('Should set a custom logger', function() {
    const logger = { hello: true, info: function() {} };
    const instance = consign({logger: logger, verbose: verbose});
    assert.equal(instance._options.logger, logger);
  });

  it('Should default to console with no logger option', function() {
    const instance = consign({verbose: verbose});
    assert.equal(instance._options.logger, console);
  });

  it('Should set the working directory to `' + cwd + '`', function() {
    const instance = consign({cwd: cwd, verbose: verbose});
    assert.equal(instance._options.cwd, cwd);
  });

  it('Should default to the .js, .json and .node extensions', function() {
    const instance = consign({verbose: verbose});
    assert.deepEqual(instance._options.extensions, ['.js', '.json', '.node']);
  });

  it('Should add a new possible extension', function() {
    assert.deepEqual(
      consign({extensions: '.hello', verbose: verbose})._options.extensions,
      ['.js', '.json', '.node', '.hello']
    );
    assert.deepEqual(
      consign({extensions: ['.a', '.b'], verbose: verbose})._options.extensions,
      ['.js', '.json', '.node', '.a', '.b']
    );
  });

  it('Should load the en-nz locale instead of default en-us', function() {
    const instance = consign({locale: 'en-nz', verbose: verbose});
    assert.equal(instance._['Initialized in'], 'Initialised in');
  });

  it('Should log through the logger using the logging type', function() {
    const lines = [];
    const logger = {
      debug: function(line) { lines.push('debug ' + line); },
      log: function(line) { lines.push('log ' + line); },
      warn: function(line) { lines.push('warn ' + line); },
      error: function(line) { lines.push('error ' + line); }
    };

    consign({cwd: 'test/test-app', logger: logger, loggingType: 'debug'})
      .include('config')
      .include('missing');

    assert.equal(lines.length, 3);
    assert.match(lines[0], /^debug consign v[\d.]+ Initialized in test\/test-app$/);
    assert.match(lines[1], /^log \+ \.[\\/]config[\\/]dev-config\.json$/);
    assert.match(lines[2], /^error ! Entity not found /);
  });

  it('Should not log when verbose is false', function() {
    const logger = { info: assert.fail, log: assert.fail, warn: assert.fail, error: assert.fail };

    consign({cwd: 'test/test-app', logger: logger, verbose: false})
      .include('config')
      .include('missing')
      .include();
  });

};
