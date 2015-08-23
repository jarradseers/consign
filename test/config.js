/*!
 * Consign config tests.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

// Module dependencies.
var path = require('path');

module.exports = function(consign, assert) {

  // Test setup.
  var cwd = path.resolve('test/test-app/controllers')
    , verbose = false
  ;

  it('Should set verbose to false', function() {
    var instance = consign({verbose: false});
    assert.equal(false, instance._options.verbose);
  });

  it('Should set a custom logger', function() {
    var logger = { hello: true, info: function() {} }
      , instance = consign({logger: logger, verbose: verbose})
    ;
    return 'hello' in instance._options.logger;
  });

  it('Should default to console with no logger option', function() {
    var instance = consign({verbose: verbose});
    return 'log' in instance._options.logger;
  });

  it('Should set the woking directory to `' + cwd + '`', function() {
    var instance = consign({cwd: cwd, verbose: verbose});
    return assert.equal(instance._options.cwd, cwd);
  });

  it('Should add a new possible extension', function() {
    var extension = '.hello'
      , instance = consign({extensions: extension, verbose: verbose})
    ;
    return assert.equal(instance._options.extensions.indexOf(extension), 0);
  });

  it('Should load the en-nz locale instead of default en-us', function() {
    var locale = 'en-nz'
      , us = 'Initialized in'
      , nz = 'Initialised in'
      , instance = consign({locale: locale, verbose: verbose})
    ;
    return assert.equal(instance._[us], nz);
  });

  it('Should disable watch feature', function() {
    var instance = consign({watch: false, verbose: verbose});
    return assert.equal(instance._options.watch, false);
  });
};

