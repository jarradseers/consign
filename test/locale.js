/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

// Module dependencies.
const { it } = require('node:test');
const fs = require('fs');
const path = require('path');

module.exports = function(consign, assert) {

  // Test setup.
  const strings = [
    'Initialized in',
    'Ignoring hidden entity',
    'Entity not found',
    'Ignoring extension',
    'Ignoring file'
  ];

  fs.readdirSync('locale').forEach(function(file) {
    const name = path.basename(file, path.extname(file));

    it(name.toUpperCase() + ' locale file should have ' + strings.length + ' correct locale strings', function() {
      const locale = require(path.join('..', 'locale', file));

      assert.deepEqual(Object.keys(locale), strings);
      strings.forEach(function(string) {
        assert.equal(typeof locale[string], 'string');
        assert.notEqual(locale[string], '');
      });
    });

    it(name.toUpperCase() + ' locale should load', function() {
      assert.equal(consign({locale: name, verbose: false})._options.locale, name);
    });
  });

};
