'use strict'
const express = require('express');
const config = require('../config/config');
const gossip = require('./gossip');
const opinions = require('./opinions');

// ----------> Get Router <----------

const router = express.Router();

// ----------> Bootstrap Gossip Member <----------

const member = gossip.bootstrap();

gossip.initialScore(member);

// ----------> Define API Routes <----------

if (config.local.mode == 'member') {

	router.post('/api/new_opinion', function (req, res) {
		// TODO: gossip.getMembers() returns all local meta, need just opinion
		// const localOpinion = gossip.getLocalMeta();
		// TODO: gossip.getMembers() returns all members, need just array of opinions
		// const memberOpinions = gossip.getMembers();
		// const newScore = opinions.newOpinionFromClient(localOpinion, memberOpinions);

		// TODO: I assume below needs newScore passed?
		gossip.updateScore(member, req, res)
	});
	
}

module.exports = router;