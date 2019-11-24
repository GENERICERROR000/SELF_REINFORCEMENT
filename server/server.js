'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const logger = require('morgan');
const peer = require('peer');
const config = require('./config/config');
const apiRoutes = require('./src/routes');

const mode = config.local.mode;

// ----------> Create Config File For Clients <----------

const toWrite = `
	const BASE_URL = '${config.local.host}';
	const PEER_SERVER = '${config.cluster.peerServer}';
`

if (mode == 'base') {
	fs.writeFileSync(__dirname + '/../public/display/js/env.js', toWrite)
// }
// WARN: This is temporary for dev
// if (mode == 'member') {
	fs.writeFileSync(__dirname + '/../public/opinion/js/env.js', toWrite)
}

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
// WARN: This is temporary for dev
// if (mode == 'member') {
	app.use('/opinion', (req, res, next) => {
		express.static('public/opinion')(req, res, next);
	});
}

// ----------> Set API Routes <----------

app.use(apiRoutes);

module.exports = server;