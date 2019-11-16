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
	let host = config.local.host
	let port = config.local.port
	let name = config.local.name

	switch (config.local.mode) {
		case 'base':
			active = newBase(bases, host, port, name);
			break;

		case 'member':
			active = newMember(bases, host, port, name);
			break;

		case 'display':
			active = newDisplay(bases, host, port, name);
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

	member.on('add', console.log)

	member.on('remove', console.log)

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
			meta: ['name']
		}
	};

	let monitor = sneeze(opts)

	monitor.on('add', console.log)

	monitor.on('remove', console.log)

	monitor.join({
		name: name
	})

	return monitor;
}

// -----> End Bootstrap Helper Functions <-----

exports.getLocalState = (sneeze) => {
	// This public member variable is null until the instance sucessfully joins a network.It is descriptive object containing meta data about this instance.
	// sneeze.info
}

exports.getMembers = (sneeze) => {
	// Returns an array of member description objects.These are the currently known and healthy members.
	// sneeze.members()
}

exports.updateScore = function (req, res) {
	let newScores = {}

	// console.log('poop')
	// console.log('poop')
	// console.log('poop')
	// console.log('poop')
	// console.log('poop')
	// console.log('poop')

	// let err = sneeze.updateScore(config.local.name, newScores)

	// res.end('<h1>THAT WORKED</h1>')

	// if (err) {
	// 	console.error("ERROR:", err)
	// } else {
	// 	res.status(201).send('<h1>THAT WORKED</h1>')
	// }
	res.end('<h1>THAT WORKED</h1>')
}

exports.joinCluster = (sneeze) => {

}

exports.leaveCluster = (sneeze) => {
	// Leave the network.You can also leave just by exiting the process - SWIM is designed to handle that.This method is just to give you extra control.
	// sneeze.leave()
}
