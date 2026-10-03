module.exports = class User {
  constructor(app, extra) {
    this.app = app;
    this.extra = extra;
  }
  find() {
    return "found";
  }
};
