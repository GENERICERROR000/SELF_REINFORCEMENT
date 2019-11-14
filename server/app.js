var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	helmet = require('helmet');

var app = express();

// ----------> Set Middleware <----------

app.use(logger('common'));
app.use(helmet());

app.use(require('./routes'));
app.use(express.static('public'));
app.use(bodyParser.json());

module.exports = app;