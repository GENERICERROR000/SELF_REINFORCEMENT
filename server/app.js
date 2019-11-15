'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');

const app = express();

// ----------> Set Middleware <----------

app.use(logger('common'));
app.use(helmet());

app.use(require('./routes'));
app.use(express.static('public'));
app.use(bodyParser.json());

module.exports = app;