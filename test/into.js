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

  const fixtures = {
    cwd: 'test/fixtures',
    verbose: false
  };

  it('Should load the test app into object', function() {
    const app = {};
    consign(options)
      .include('models, controllers')
      .into(app);

    ['one', 'two', 'three'].forEach(function(file) {
      assert.equal(typeof app.models[file], 'function');
      assert.equal(typeof app.controllers[file], 'function');
    });
  });

  it('Should load only models into object', function() {
    const app = {};
    consign(options)
      .include('models')
      .into(app);

    assert.equal(typeof app.models.one, 'function');
    assert.equal(app.controllers, undefined);
  });

  it('Should load only controllers into object', function() {
    const app = {};
    consign(options)
      .include('controllers')
      .into(app);

    assert.equal(typeof app.controllers.one, 'function');
    assert.equal(app.models, undefined);
  });

  it('Should load only controllers into object in the correct numerical order', function() {
    const app = {};
    consign(options)
      .include('controllers/one.js, controllers/two.js, controllers')
      .into(app);

    assert.equal(Object.keys(app.controllers).join(''), 'onetwothree');
  });

  it('Should be able to execute a script', function() {
    const app = {};
    consign(options)
      .include('controllers')
      .into(app, true);

    assert.equal(app.controllers.one.run, true);
  });

  it('Should return the instance, so more can be loaded', function() {
    const app = {};
    const instance = consign(options).include('models');

    assert.equal(instance.into(app), instance);
    instance.include('config').into(app);
    assert.deepEqual(app.config['dev-config'], require('./test-app/config/dev-config.json'));
  });

  it('Should load json and plain values as they are', function() {
    const app = {};
    consign(fixtures)
      .include('values')
      .into(app);

    assert.deepEqual(app.values.settings, { port: 3000 });
    assert.deepEqual(app.values.object, { plain: true });
    assert.equal(app.values.nothing, null);
  });

  it('Should construct a module that exports a class', function() {
    const app = {};
    consign(fixtures)
      .include('classes/user.js')
      .into(app, 'extra');

    assert.equal(app.classes.user.constructor.name, 'User');
    assert.equal(app.classes.user.app, app);
    assert.equal(app.classes.user.extra, 'extra');
    assert.equal(app.classes.user.find(), 'found');
  });

  it('Should use the default export of a transpiled module', function() {
    const app = {};
    consign(fixtures)
      .include('classes/es-default.js')
      .into(app);

    assert.equal(app.classes['es-default'].viaDefault, true);
    assert.equal(app.classes['es-default'].app, app);
  });

  it('Should name keys from the path below a cwd that appears again in the path', function() {
    const app = {};
    consign({cwd: 'test/fixtures/app', verbose: false})
      .include('controllers')
      .into(app);

    assert.deepEqual(Object.keys(app), ['controllers']);
    assert.deepEqual(Object.keys(app.controllers), ['appUser']);
    assert.equal(app.controllers.appUser, 'appUser');
  });

  it('Should keep the full name of a directory with a dot in it', function() {
    const app = {};
    consign(fixtures)
      .include('dotted')
      .into(app);

    assert.equal(app.dotted['v1.0'].thing, 'thing');
  });

  it('Should load a fresh copy of each file every time', function() {
    const first = {};
    const second = {};
    const instance = consign(fixtures).include('values/object.js');

    instance.into(first);
    instance.into(second);

    assert.notEqual(first.values.object, second.values.object);
  });

  it('Should throw an error naming the file that failed to load', function() {
    const file = path.resolve('test/fixtures/broken/bad.js');

    assert.throws(function() {
      consign(fixtures).include('broken').into({});
    }, function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.indexOf('Failed to require: ' + file + ', because: ') === 0);
      assert.ok(err.cause instanceof SyntaxError);
      return true;
    });
  });

};
