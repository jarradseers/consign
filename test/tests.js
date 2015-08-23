/*!
 * Consign config tests.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */


// Module dependencies.
var consign = require(__dirname + '/../')
  , pack = require(__dirname + '/../package')
  , path = require('path')
  , assert = require('assert')
;

// Test file setup.
var tests = [
  'config',
  'locale',
  'include',
  'exclude',
  'into'
];

function formatName(name) {
  var parts = name.split('-');

  for (var p in parts) {
    var part = parts[p];
    parts[p] = part.charAt(0).toUpperCase() + part.slice(1);
  }

  return parts.join(' ');
}

// Include unit tests.
describe(pack.name + ' v' + pack.version, function() {
  tests.forEach(function(test) {
    describe('Test case: ' + formatName(test), function() {
      require(path.join(__dirname, test))(consign, assert);
    });
  });
});