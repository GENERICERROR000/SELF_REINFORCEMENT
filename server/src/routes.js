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

// ----------> Generate Opinions <----------

var segmentationOpinions = opinions.generate();
console.log(segmentationOpinions)
// ----------> Define API Routes <----------

// if (config.local.mode == 'member') { WARN: This is temporary for dev

// TODO: SERVER CODE MAY NEED TO USE PROMISES FOR SOME OF THE WORK.
// 		 OTHERWISE MAY SLOW DOWN EXECUTION FOR
// 		 SERVER ITSELF.RESULTS OF NEW OPINIONS SHOULD DEF BE ASYNC...

	// New ML Segmentation Data
	router.post('/api/opinion', function (req, res) {
		// TODO: gossip.getMembers() returns all local meta, need just opinion
		// const localOpinion = gossip.getLocalMeta();
		// TODO: gossip.getMembers() returns all members, need just array of opinions
		// const memberOpinions = gossip.getMembers();
		// const newScore = opinions.newOpinionFromClient(localOpinion, memberOpinions);

		// TODO: I assume below needs newScore passed?
		// gossip.updateScore(member, req, res)

		console.log(req.body)
		res.end();
	});

	// Reset Local Opinions
	router.post('/api/new_opinions', function (req, res) {
		// TODO: Something like:
		// segmentationOpinions = opinions.generate();

		console.log(req.body)
		res.end();
	});
	
// }

module.exports = router;