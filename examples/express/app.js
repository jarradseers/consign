var express = require('express')
  , consign = require('../../')
  , app = express()
;

consign()
  .include('models')
  .then('middleware')
  .then('routers')
  .into(app)
;

app.listen(3000, function() {
  console.log('App listening on 3000');
});