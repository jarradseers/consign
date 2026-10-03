/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

// Module dependencies.
const { describe } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const consign = require('../');
const pack = require('../package');

// The test cases use paths relative to the package root.
process.chdir(path.join(__dirname, '..'));

// Test file setup.
const tests = [
  'config',
  'locale',
  'include',
  'exclude',
  'into',
  'ignore'
];

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Include unit tests.
describe(pack.name + ' v' + pack.version, function() {
  tests.forEach(function(test) {
    describe('Test case: ' + formatName(test), function() {
      require(path.join(__dirname, test))(consign, assert);
    });
  });
});
