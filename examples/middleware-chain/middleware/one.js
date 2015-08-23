/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app) {

  this.run = function(context, next) {
    setTimeout(function() {
      context.one = 'Hello';
      console.log('Hello from one', context);
      return next();
    }, 1000);
  }

  // Return this module.
  return this;

};