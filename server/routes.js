'use strict'
const express = require('express');
const gossip = require('./src/gossip');

const router = express.Router();
const member = gossip.bootstrap();

gossip.initialScore(member)

router.get('/test', function (req, res) {
	gossip.updateScore(member, req, res)
});

module.exports = router;