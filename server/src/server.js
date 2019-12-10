'use strict'
const express = require('express');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const logger = require('morgan');
const config = require('../config/config');
const WebSocket = require('ws');

// NOTE: -----> Create Config File For Client <-----

const toWrite = `
	const BASE_URL = '${config.host}';
	const BASE_PORT = '${config.port}';
`
fs.writeFileSync(__dirname + '/../../public/js/env.js', toWrite)

// NOTE: -----> Create HTTPS Server <-----

const app = express();

const key = fs.readFileSync(__dirname + '/../../certs/selfsigned.key');
const cert = fs.readFileSync(__dirname + '/../../certs/selfsigned.crt');

const options = {
	key: key,
	cert: cert
};

const server = https.createServer(options, app);

// NOTE: -----> Set Middleware <-----

// TODO: Set for prod logs
// app.use(logger('combined'));
app.use(logger('common'));
app.use(helmet());

// NOTE: -----> Set Static Directory <-----

app.use(express.static('public'));

module.exports = server;
