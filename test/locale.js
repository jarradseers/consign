/*!
 * Consign locale tests.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */


// Module dependencies.

var fs = require('fs')
  , path = require('path')
;

module.exports = function(consign, assert) {

  // Test setup.
  var files = fs.readdirSync('locale')
    , strings = [
      'Initialized in',
      'Ignoring hidden entity',
      'Entity not found'
    ]
  ;

  function checkStrings() {
    return assert.deepEqual(Object.keys(locale), strings);
  }

  for (var f in files) {
    var file = files[f]
      , locale = require(path.join('..', 'locale', file))
      , name = path.basename(file, path.extname(file)).toUpperCase()
    ;

    it(name + ' locale file should have ' + strings.length + ' correct locale strings', checkStrings);
  }

};

