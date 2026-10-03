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
  const cwd = 'test/fixtures';
  const verbose = false;

  function resolve(files) {
    return files.map(function(file) {
      return path.resolve(path.join(cwd, file));
    });
  }

  it('Should include everything without an ignore option', function() {
    const instance = consign({cwd: cwd, verbose: verbose}).include('ignore');
    assert.deepEqual(instance._files, resolve([
      'ignore/__mocks__/user.js',
      'ignore/user.js',
      'ignore/user.test.js'
    ]));
  });

  it('Should ignore files and directories matching a regular expression', function() {
    const instance = consign({cwd: cwd, verbose: verbose, ignore: /\.test\.js$|__mocks__/}).include('ignore');
    assert.deepEqual(instance._files, resolve(['ignore/user.js']));
  });

  it('Should work with a global regular expression', function() {
    const instance = consign({cwd: cwd, verbose: verbose, ignore: /user/g}).include('ignore, ignore');
    assert.deepEqual(instance._files, []);
  });

  it('Should ignore using a function given the path relative to cwd', function() {
    const seen = [];
    const instance = consign({
      cwd: cwd,
      verbose: verbose,
      ignore: function(file) {
        seen.push(file);
        return file !== 'ignore' && file !== 'ignore/user.js';
      }
    }).include('ignore');

    assert.deepEqual(instance._files, resolve(['ignore/user.js']));
    assert.deepEqual(seen, ['ignore', 'ignore/__mocks__', 'ignore/user.js', 'ignore/user.test.js']);
  });

  it('Should load the remaining files without touching the ignored ones', function() {
    const app = {};
    consign({cwd: cwd, verbose: verbose, ignore: /\.test\.js$|__mocks__/})
      .include('ignore')
      .into(app);

    assert.deepEqual(Object.keys(app.ignore), ['user']);
  });

};
