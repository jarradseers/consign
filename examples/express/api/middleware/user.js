/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app) {

  var User = app.models.user;

  this.index = function(req, res, next) {
    return res.redirect('/users');
  };

  this.getAll = function(req, res, next) {
    var users = User.find();
    return res.json(users);
  };

  this.getByName = function(req, res, next) {
    var user = User.findByName(req.params.name);
    return res.json(user);
  };

  return this;

};