/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app) {

  var User = app.models.user;

  this.add = function() {
    // add a user.
    User.create();
    // render stuff.
  };

  this.remove = function() {
    // remove a user.
    User.remove();
    // render stuff.
  };

  // return this controller object
  return this;

};