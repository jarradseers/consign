var consign = require('../../')
  , app = {}
;

consign()
  .include('models')
  .then('controllers')
  .then('routers')
  .into(app)
;

console.log(app);