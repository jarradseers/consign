/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

var consign = require('../../')
  , app = {}
;

consign()
  .include('models')
  .then('controllers')
  .into(app)
;

console.log(app);