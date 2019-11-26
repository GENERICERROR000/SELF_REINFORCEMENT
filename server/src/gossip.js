'use strict'
const config = require('../config/config');
const sneeze = require('../lib/sneeze');

const local = config.local;

// ----------> Bootstrap Member <----------

// NOTE: This is to be called on server startup, not for api use
exports.bootstrap = (segmentationOpinions) => {
	let active;

	// TODO: THIS IS NOT DONE - active.newOnUpdate() need to be set for base and member
	switch (local.mode) {
		case 'base':
			active = newBase();
			active.newOnUpdate(function () {
				console.log("");
				console.log('CHANGE MOTHERFUCKER');
			})
			break;

		case 'member':
			active = newMember(segmentationOpinions);
			active.newOnUpdate(function () {
				console.log("");
				console.log('CHANGE MOTHERFUCKER');
			})
			break;

		case 'monitor':
			active = newMonitor();
			break;

		default:
			active = newMember(segmentationOpinions);
	}

	return active;
}

// -----> Bootstrap Helper Functions <-----

// { identifier: null }
// You can provide a unique identifier for your instance.
// This is generated automatically if you do not provide one.
const newBase = () => {
	const { bases, host, port, name, mode } = local;
	let opts = {
		isbase: true,
		silent: true,
		bases: bases,
		host: host,
		port: port,
		_meta: {
			mode: mode
		}
	};

	let base = sneeze(opts);

	// base.on('add', console.log);
	// base.on('remove', console.log);

	base.join({ name: name });

	return base;
}

const newMember = (segmentationOpinions) => {
	const { bases, host, port, name, id, mode } = local;
	let opts = {
		silent: true,
		bases: bases,
		host: host,
		port: port,
		_meta: {
			id: id,
			name: name,
			initialPrefs: segmentationOpinions,
			mode: mode
		}
	};

	let member = sneeze(opts);

	// member.on('add', console.log);
	// member.on('remove', console.log);

	member.join({ name: name });

	return member;
}

const newMonitor = () => {
	const { bases, host, port, name, mode } = local;
	let opts = {
		silent: true,
		bases: bases,
		host: host,
		port: port,
		monitor: {
			active: true,
			meta: ['opinions']
		},
		_meta: {
			mode: mode
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
	console.log("-----INITIAL OPINIONS-----");
	console.log(member.getLocalScore().meta.opinions);
	console.log("");
}


// -----> Return Local Metadata <-----

exports.getLocalMeta = (member) => {
	const localMeta = member.getLocalScore();
	console.log(localMeta);
}

// -----> Return Members In Network <-----

exports.getMembers = (member) => {
	const members = member.members();
	return members;
}

// -----> Update Local Score - Update Meta <-----

exports.updateScore = function (member, newScore) {
	const newMeta = member.updateLocalScore(newScore);
	
	console.log("");
	console.log("-----NEW OPINIONS-----");
	console.log(newMeta);
	console.log("");
}	

// exports.joinCluster = (sneeze) => {}
// exports.leaveCluster = (sneeze) => {}
