'use strict'
const config = require('../config/config');
const sneeze = require('../lib/sneeze');

// ----------> Bootstrap Member <----------

// NOTE: This is to be called on server startup, not for api use
exports.bootstrap = (segmentationOpinions) => {
	let active;
	let bases = config.cluster.bases;
	let local = config.local;

	// TODO: THIS IS NOT DONE - active.newOnUpdate() need to be set for base and member
	switch (mode) {
		case 'base':
			active = newBase(local);
			active.newOnUpdate(function () {
				console.log("");
				console.log('CHANGE MOTHERFUCKER');
			})
			break;

		case 'member':
			active = newMember(local, segmentationOpinions);
			active.newOnUpdate(function () {
				console.log("");
				console.log('CHANGE MOTHERFUCKER');
			})
			break;

		case 'monitor':
			active = newMonitor(local);
			break;

		default:
			active = newMember(local, segmentationOpinions);
	}

	return active;
}

// -----> Bootstrap Helper Functions <-----

// { identifier: null }
// You can provide a unique identifier for your instance.
// This is generated automatically if you do not provide one.
const newBase = (local) => {
	const { bases, host, port, name } = local;
	let opts = {
		isbase: true,
		silent: true,
		bases: bases,
		host: host,
		port: port
	};

	let base = sneeze(opts);

	// base.on('add', console.log);
	// base.on('remove', console.log);

	base.join({ name: name });

	return base;
}

const newMember = (local, segmentationOpinions) => {
	const { bases, host, port, name, id } = local;
	let opts = {
		silent: true,
		bases: bases,
		host: host,
		port: port,
		_meta: {
			id: id,
			name: name,
			initialPrefs: segmentationOpinions
		}
	};

	let member = sneeze(opts);

	// member.on('add', console.log);
	// member.on('remove', console.log);

	member.join({ name: name });

	return member;
}

const newMonitor = (local) => {
	const { bases, host, port, name } = local;
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

	let monitor = sneeze(opts);

	// monitor.on('add', console.log);
	// monitor.on('remove', console.log);

	monitor.join({ name: name });

	return monitor;
}

// -----> Print Initial Score <-----

// NOTE: This is to be called on server startup, not for api use
exports.initialScore = function (member) {
	console.log("");
	console.log("-----INITIAL SCORE-----");
	console.log(member.getLocalScore().meta.score);
}


// -----> Return Local Metadata <-----

exports.getLocalMeta = (member) => {
	let localMeta = member.getLocalScore();
	console.log(localMeta);
}

// -----> Return Members In Network <-----

exports.getMembers = (member) => {
	let members = member.members();
	console.log(members);
}

// -----> Update Local Score - Update Meta <-----

exports.updateScore = function (member, newScore) {
	// TODO: WARN: set this!
	let newScore = 85;

	let newMeta = member.updateLocalScore(newScore);
	
	console.log("");
	console.log("-----NEW SCORE-----");
	console.log(newMeta.score);
}	

// exports.joinCluster = (sneeze) => {}
// exports.leaveCluster = (sneeze) => {}
