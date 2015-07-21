module.exports = function(app, modify) {
  if (modify) this.run = true;
  this.hello = "hi";
  return this;
};