'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const peer = require('peer');
const https = require('https');
const fs = require('fs');
const config = require('./config/config')
const routes = require('./src/routes');

// ----------> Create HTTPS Server <----------

const app = express();
const key = fs.readFileSync(__dirname + '/../certs/selfsigned.key');
const cert = fs.readFileSync(__dirname + '/../certs/selfsigned.crt');

const options = {
	key: key,
	cert: cert
};

const server = https.createServer(options, app);

// ----------> Set Route for PeerJS API <----------

if (config.local.mode == 'base') {
	const peerOptions = {
		debug: false
	};

	const peerServer = peer.ExpressPeerServer(server, peerOptions);

	app.use('/api/peer', peerServer);
}

// ----------> Set Middleware <----------

app.use(logger('common'));
app.use(helmet());
app.use(routes);
app.use(bodyParser.json());

// ----------> Set Static Routes <----------

app.use(express.static('public/root'));

// TODO: Can the following 2 be inside the public dir or is that just a nightmare? if yes, then above should have own dir inside public as well
app.use('/display', (req, res, next) => {
	express.static('public/display')(req, res, next);
});

app.use('/opinion', (req, res, next) => {
	express.static('public/opinion')(req, res, next);
});

module.exports = server;