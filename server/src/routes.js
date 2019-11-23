'use strict'
const express = require('express');
const config = require('../config/config');
const gossip = require('./gossip');

// ----------> Get Router <----------

const router = express.Router();

// ----------> Bootstrap Gossip Member <----------

const member = gossip.bootstrap();

gossip.initialScore(member);

// ----------> Define API Routes <----------

if (config.local.mode == 'member') {
	router.post('/api/score', function (req, res) {
		gossip.updateScore(member, req, res)
	});
}

module.exports = router;