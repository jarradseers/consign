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
  .then('routers')
  .into(app)
;

console.log(app);