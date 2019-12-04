'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const logger = require('morgan');
const peer = require('peer');
const config = require('./config/config');

// ----------> Create Config File For Clients <----------

const toWrite = `
	const BASE_URL = '${config.host}';
	const BASE_PORT = '${config.port}';
`
fs.writeFileSync(__dirname + '/../public/display/js/env.js', toWrite)
fs.writeFileSync(__dirname + '/../public/parts/js/env.js', toWrite)

// ----------> Create HTTPS Server <----------

const app = express();

const key = fs.readFileSync(__dirname + '/../certs/selfsigned.key');
const cert = fs.readFileSync(__dirname + '/../certs/selfsigned.crt');

const options = {
	key: key,
	cert: cert
};

const server = https.createServer(options, app);

// ----------> Set Middleware <----------

app.use(logger('common'));
app.use(helmet());
app.use(bodyParser.json());

// ----------> Set Route for PeerJS API <----------

const peerOptions = {
	debug: false
};

const peerServer = peer.ExpressPeerServer(server, peerOptions);

app.use('/api/peer', peerServer);

// ----------> Set Static Routes <----------

app.use(express.static('public'));

app.use('/display', (req, res, next) => {
	express.static('public/display')(req, res, next);
});

app.use('/parts', (req, res, next) => {
	express.static('public/parts')(req, res, next);
});

module.exports = server;