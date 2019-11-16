'use strict'
const express = require('express');
const gossip = require('./src/gossip');

const router = express.Router();
const member = gossip.bootstrap();

router.get('/test', function (req, res) {
	gossip.updateScore(member, req, res)
});

gossip.initialScore(member)

module.exports = router;