'use strict'
const express = require('express');
const config = require('../config/config');
const gossip = require('./gossip');
const opinions = require('./opinions');

const mode = config.local.mode;

// ----------> Get Router <----------

const router = express.Router();

// ----------> Generate Opinions <----------

var segmentationOpinions = mode == 'member' ? opinions.generate() : {};

// ----------> Bootstrap Gossip Member <----------

const member = gossip.bootstrap(segmentationOpinions);

gossip.initialScore(member);

// ----------> Define API Routes <----------

if (mode == 'member') {
	// TODO: SERVER CODE MAY NEED TO USE PROMISES FOR SOME OF THE WORK.
	// 		 OTHERWISE MAY SLOW DOWN EXECUTION FOR
	// 		 SERVER ITSELF.RESULTS OF NEW OPINIONS SHOULD DEF BE ASYNC...

	// New ML Segmentation Data
	router.post('/api/opinion', function (req, res) {
		const newClientOpinions = req.body.keypoints;

		// TODO: newFromClient() requires member ogj - maybe needs gossip obj???
		opinions.newFromClient(member, newClientOpinions, segmentationOpinions)

		// TODO: I assume below needs newScore passed?
		// gossip.updateScore(member, req, res)

		console.log(newClientOpinions)
		res.end();
	});

	// Reset Local Opinions
	router.post('/api/new_opinions', function (req, res) {
		// TODO: Something like:
		// segmentationOpinions = opinions.generate();

		console.log(req.body)
		res.end();
	});
	
}

module.exports = router;