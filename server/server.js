'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const peer = require('peer');
const https = require('https');
const fs = require('fs');
const config = require('./config/config');

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

const peerOptions = {
	debug: false
};

const peerserver = peer.ExpressPeerServer(server, peerOptions);

app.use('/peer', peerserver);

// ----------> Set Middleware <----------

app.use(logger('common'));
app.use(helmet());
app.use(require('./routes'));
app.use(bodyParser.json());

// ----------> Set Static Routes <----------

app.use(express.static('public'));

app.use('/base', (req, res, next) => {
	express.static('rec')(req, res, next);
});

app.use('/member', (req, res, next) => {
	express.static('sen')(req, res, next);
});


module.exports = server;