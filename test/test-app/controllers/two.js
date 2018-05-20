/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app, relativePath) {
  if (relativePath) this.relativePath = relativePath;
  return this;
};