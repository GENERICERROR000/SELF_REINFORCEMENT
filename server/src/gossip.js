'use strict'
// var Swim = require('swim');
const sneeze = require('../lib/sneeze');
const config = require('../config/config')

// TODO: Sneeze does not have method for updating meta data. Need data to spread via gossip. Need
// 		 to add method. Either edit node_modules, or import sneeze.js and edit it (is a single file)

// NOTE: This is to be called on server startup, not for api use
exports.bootstrap = () => {
	let active
	let bases = config.cluster.bases
	let { host, port, mode, name } = config.local
	
	switch (mode) {
		case 'base':
			active = newBase(bases, host, port, name);
			break;

		case 'member':
			active = newMember(bases, host, port, name);
			active.newOnUpdate(function () {
				console.log("")
				console.log('CHANGE MOTHERFUCKER')
			})
			break;

		case 'display':
			active = newDisplay(bases, host, port, name);
			active.newOnUpdate(function () {
				console.log("")
				console.log('CHANGE MOTHERFUCKER')
			})
			break;

		case 'monitor':
			active = newMonitor(bases, host, port, name);
			break;

		default:
			active = newBase(bases, host, port, name);
	}

	return active;
}

// -----> Start Bootstrap Helper Functions <-----

// identifier: null
// You can provide a unique identifier for your instance.This is generated automatically if you do not provide one.

const newBase = (bases, host, port, name) => {
	let opts = {
		isbase: true,
		silent: true,
		bases: bases,
		host: host,
		port: port
	};

	let base = sneeze(opts);

	base.join({
		name: name
	});

	return base;
}

const newMember = (bases, host, port, name) => {
	let opts = {
		silent: true,
		bases: bases,
		host: host,
		port: port
	};

	let member = sneeze(opts)

	// member.on('add', console.log)

	// member.on('remove', console.log)

	member.join({
		name: name
	})

	return member;
}

// TODO: Change this to monitor settings or remove
const newDisplay = (bases, host, port, name) => {
	let opts = {
		silent: true,
		bases: bases,
		host: host,
		port: port
	};

	let display = sneeze(opts)

	display.on('add', console.log)

	display.on('remove', console.log)

	display.join({
		name: name
	})

	return display;
}

const newMonitor = (bases, host, port, name) => {
	let opts = {
		silent: true,
		bases: bases,
		host: host,
		port: port,
		monitor: {
			active: true,
			meta: ['name', 'score']
		}
	};

	let monitor = sneeze(opts)

	// monitor.on('add', console.log)

	// monitor.on('remove', console.log)

	monitor.join({
		name: name
	})

	return monitor;
}

// -----> End Bootstrap Helper Functions <-----

exports.initialScore = function (member) {
	console.log("");
	console.log("-----INITIAL SCORE-----");
	console.log(member.getLocalScore().meta.score);
}

exports.getLocalMeta = (member) => {
	let localMeta = member.getLocalScore();
	console.log(localMeta);
}

exports.getMembers = (member) => {
	let members = member.members();
	console.log(members);
}

exports.updateScore = function (member, req, res) {
	let newScores = {
		id: "catdog",
		love: "carl",
		hate: "carla",
		noOpinion: "haha"
	}; // TODO: Figure out real object

	let newMeta = member.updateLocalScore(config.local.name, newScores);
	
	console.log("");
	console.log("-----NEW SCORE-----");
	console.log(newMeta.score);

	if (!newMeta) {
		console.error("ERROR:", err);
	} else {
		res.end('<h1>THAT WORKEDm</h1><h3>' + new Date() + '</h3>');
	};
}	

// exports.joinCluster = (sneeze) => {

// }

// exports.leaveCluster = (sneeze) => {

// }
