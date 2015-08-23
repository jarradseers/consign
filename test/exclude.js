/*!
 * Consign exclude tests.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */


// Module dependencies.
var path = require('path');

module.exports = function(consign, assert) {

  // Test setup.
  var options = {
    cwd: 'test/test-app',
    verbose: false
  };

  it('Should exclude controllers after loading all tests', function() {
    var instance = consign(options).include('controllers, models').exclude('controllers')
      , files = [
        'models/one.js',
        'models/three.js',
        'models/two.js'
      ].map(function(file) {
        return path.resolve(path.join(options.cwd, file));
      })
    ;
    assert.deepEqual(files, instance._files);
  });

  it('Should exclude models after loading all tests', function() {
    var instance = consign(options).include('controllers, models').exclude('models')
      , files = [
        'controllers/one.js',
        'controllers/three.js',
        'controllers/two.js'
      ].map(function(file) {
        return path.resolve(path.join(options.cwd, file));
      })
    ;
    assert.deepEqual(files, instance._files);
  });

  it('Should exclude specific file', function() {
    var instance = consign(options).include('controllers').exclude('controllers/one.js')
      , files = [
        'controllers/three.js',
        'controllers/two.js'
      ].map(function(file) {
        return path.resolve(path.join(options.cwd, file));
      })
    ;
    assert.deepEqual(files, instance._files);
  });

};

