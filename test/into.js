/*!
 * Consign into tests.
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
    }
  ;

  it('Should load the test app into object', function() {
    var app = {};
    consign(options)
      .include('models, controllers')
      .into(app)
    ;
    ['one', 'two', 'three'].map(function(file) {
      assert.equal(typeof app.models[file], 'function');
      assert.equal(typeof app.controllers[file], 'function');
    });
  });

  it('Should load only models into object', function() {
    var app = {};
    consign(options)
      .include('models')
      .into(app)
    ;
    assert.equal(typeof app.models.one, 'function');
    assert.equal(app.controllers, undefined);
  });

  it('Should load only controllers into object', function() {
    var app = {};
    consign(options)
      .include('controllers')
      .into(app)
    ;
    assert.equal(typeof app.controllers.one, 'function');
    assert.equal(app.models, undefined);
  });

  it('Should load only controllers into object in the correct numerical order', function() {
    var app = {};
    consign(options)
      .include('controllers/one.js, controllers/two.js, controllers')
      .into(app)
    ;
    var str = '';
    for (var c in app.controllers) {
      str += c;
    }
    assert.equal(str, 'onetwothree');
  });

  it('Should be able to execute a script', function() {
    var app = {};
    consign(options)
      .include('controllers')
      .into(app, true)
    ;

    assert.equal(app.controllers.one.run, true);
  });

};

