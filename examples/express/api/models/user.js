/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app) {

  // you would use a db ;)
  var users = [
    {name: 'Sam'},
    {name: 'Terry'},
    {name: 'Jeff'},
    {name: 'Hayden'}
  ];

  this.find = function() {
    return users;
  };

  this.findByName = function(name) {
    for (var u in users) {
      if (users[u].name.toLowerCase() === name.toLowerCase()) {
        return users[u];
      }
    }
  };

  return this;

};