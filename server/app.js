'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var helmet = require('helmet');

var app = express();

// ----------> Set Middleware <----------

app.use(logger('common'));
app.use(helmet());

app.use(require('./routes'));
app.use(express.static('public'));
app.use(bodyParser.json());

module.exports = app;