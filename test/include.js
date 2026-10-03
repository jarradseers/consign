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
  const cwd = 'test/test-app';
  const verbose = false;

  function resolve(base, files) {
    return files.map(function(file) {
      return path.resolve(path.join(base, file));
    });
  }

  it('Should include a single file', function() {
    const instance = consign({verbose: verbose}).include('test/test-app/controllers/one.js');
    assert.deepEqual(instance._files, [path.resolve('test/test-app/controllers/one.js')]);
  });

  it('Should include all test files in the test app', function() {
    const instance = consign({verbose: verbose}).include('test/test-app');
    assert.deepEqual(instance._files, resolve(cwd, [
      'config/dev-config.json',
      'controllers/one.js',
      'controllers/three.js',
      'controllers/two.js',
      'models/one.js',
      'models/three.js',
      'models/two.js'
    ]));
  });

  it('Using CWD test/test-app, should load all test files', function() {
    const instance = consign({cwd: cwd, verbose: verbose}).include('models').then('controllers');
    assert.deepEqual(instance._files, resolve(cwd, [
      'models/one.js',
      'models/three.js',
      'models/two.js',
      'controllers/one.js',
      'controllers/three.js',
      'controllers/two.js'
    ]));
  });

  it('Should include all test files in the test app, loading models first', function() {
    const instance = consign({verbose: verbose}).include('test/test-app/models').then('test/test-app');
    assert.deepEqual(instance._files, resolve(cwd, [
      'models/one.js',
      'models/three.js',
      'models/two.js',
      'config/dev-config.json',
      'controllers/one.js',
      'controllers/three.js',
      'controllers/two.js'
    ]));
  });

  it('Should include test files loaded in via comma separated string', function() {
    const instance = consign({cwd: cwd, verbose: verbose}).include('models, controllers');
    assert.deepEqual(instance._files, resolve(cwd, [
      'models/one.js',
      'models/three.js',
      'models/two.js',
      'controllers/one.js',
      'controllers/three.js',
      'controllers/two.js'
    ]));
  });

  it('Should include controller files in specific file order loaded in via comma separated string', function() {
    const instance = consign({cwd: cwd, verbose: verbose})
      .include('controllers/one.js, controllers/two.js, controllers/three.js');
    assert.deepEqual(instance._files, resolve(cwd, [
      'controllers/one.js',
      'controllers/two.js',
      'controllers/three.js'
    ]));
  });

  it('Should include model files in specific file order loaded in via comma separated string', function() {
    const instance = consign({cwd: cwd, verbose: verbose}).include('models/one.js, models/two.js, models');
    assert.deepEqual(instance._files, resolve(cwd, [
      'models/one.js',
      'models/two.js',
      'models/three.js'
    ]));
  });

  it('Should accept an absolute working directory', function() {
    const instance = consign({cwd: path.resolve(cwd), verbose: verbose}).include('config');
    assert.deepEqual(instance._files, resolve(cwd, ['config/dev-config.json']));
  });

  it('Should skip an entity that does not exist, or is not given', function() {
    const instance = consign({cwd: cwd, verbose: verbose}).include('nothing-here').include().include('config');
    assert.deepEqual(instance._files, resolve(cwd, ['config/dev-config.json']));
  });

  it('Should only include files with a known extension', function() {
    const instance = consign({cwd: 'test/fixtures', verbose: verbose}).include('mixed');
    assert.deepEqual(instance._files, resolve('test/fixtures/mixed', ['UPPER.JS', 'one.js']));
  });

  it('Should include files with an added extension', function() {
    const instance = consign({cwd: 'test/fixtures', verbose: verbose, extensions: ['.hello']}).include('mixed');
    assert.deepEqual(instance._files, resolve('test/fixtures/mixed', ['UPPER.JS', 'custom.hello', 'one.js']));
  });

};
