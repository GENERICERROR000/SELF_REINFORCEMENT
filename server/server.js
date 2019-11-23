'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const peer = require('peer');
const https = require('https');
const fs = require('fs');
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

const peerOptions = {
	debug: false
};

const peerserver = peer.ExpressPeerServer(server, peerOptions);

app.use('/api/peer', peerserver);

// ----------> Set Middleware <----------

app.use(logger('common'));
app.use(helmet());
app.use(routes);
app.use(bodyParser.json());

// ----------> Set Static Routes <----------

app.use(express.static('public/root'));

// TODO: Can the following 2 be inside the public dir or is that just a nightmare? if yes, then above should have own dir inside public as well
app.use('/base', (req, res, next) => {
	express.static('public/base')(req, res, next);
});

app.use('/member', (req, res, next) => {
	express.static('public/member')(req, res, next);
});

module.exports = server;