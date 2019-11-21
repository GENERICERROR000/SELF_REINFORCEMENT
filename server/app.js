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
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/base', (req, res, next) => {
	express.static('rec')(req, res, next);
});

app.use('/member', (req, res, next) => {
	express.static('sen')(req, res, next);
});

module.exports = app;