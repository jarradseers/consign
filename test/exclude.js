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
  const options = {
    cwd: 'test/test-app',
    verbose: false
  };

  function resolve(files) {
    return files.map(function(file) {
      return path.resolve(path.join(options.cwd, file));
    });
  }

  it('Should exclude controllers after loading all tests', function() {
    const instance = consign(options).include('controllers, models').exclude('controllers');
    assert.deepEqual(instance._files, resolve([
      'models/one.js',
      'models/three.js',
      'models/two.js'
    ]));
  });

  it('Should exclude models after loading all tests', function() {
    const instance = consign(options).include('controllers, models').exclude('models');
    assert.deepEqual(instance._files, resolve([
      'controllers/one.js',
      'controllers/three.js',
      'controllers/two.js'
    ]));
  });

  it('Should exclude specific file', function() {
    const instance = consign(options).include('controllers').exclude('controllers/one.js');
    assert.deepEqual(instance._files, resolve([
      'controllers/three.js',
      'controllers/two.js'
    ]));
  });

  it('Should exclude via comma separated string', function() {
    const instance = consign(options).include('controllers').exclude('controllers/one.js, controllers/two.js');
    assert.deepEqual(instance._files, resolve(['controllers/three.js']));
  });

  it('Should keep excluding with then', function() {
    const instance = consign(options)
      .include('controllers')
      .exclude('controllers/one.js')
      .then('controllers/two.js');
    assert.deepEqual(instance._files, resolve(['controllers/three.js']));
  });

  it('Should leave the list alone when excluding a file that was not included', function() {
    const instance = consign(options).include('controllers').exclude('models/one.js').exclude('models');
    assert.deepEqual(instance._files, resolve([
      'controllers/one.js',
      'controllers/three.js',
      'controllers/two.js'
    ]));
  });

};
