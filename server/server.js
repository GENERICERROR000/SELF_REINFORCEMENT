'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const peer = require('peer');
const https = require('https');
const fs = require('fs');
const config = require('./config/config');
const apiRoutes = require('./src/routes');

const mode = config.local.mode;

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

if (mode == 'base') {
	const peerOptions = {
		debug: false
	};

	const peerServer = peer.ExpressPeerServer(server, peerOptions);

	app.use('/api/peer', peerServer);
}

// ----------> Set Static Routes <----------

app.use(express.static('public/root'));

if (mode == 'base') {
	app.use('/display', (req, res, next) => {
		express.static('public/display')(req, res, next);
	});
// }

// if (mode == 'member') {
	app.use('/opinion', (req, res, next) => {
		express.static('public/opinion')(req, res, next);
	});
}

// ----------> Set API Routes <----------

app.use(apiRoutes);

module.exports = server;