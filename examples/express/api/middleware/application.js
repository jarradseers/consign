/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.send('hello');
  });

  return this;
};
