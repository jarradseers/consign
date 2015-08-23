/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

var express = require('express')
  , consign = require('../../')
  , app = express()
;

consign({cwd: 'api'})
  .include('models')
  .then('middleware')
  .then('routers')
  .into(app)
;

app.listen(3000, function() {
  console.log('App listening on 3000');
});
