/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app, modify) {
  if (modify) this.run = true;
  this.hello = "hi";
  return this;
};