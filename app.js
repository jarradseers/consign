var consign = require('./');

var app = {};

var next = function() {
	console.log('Next called.');
};

consign({verbose: true}).include('test').into(app, 'helo', 'there');

console.log(app);