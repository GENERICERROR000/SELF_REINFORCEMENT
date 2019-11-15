'use strict'
// var Swim = require('swim');
const sneeze = require('sneeze');
const config = require('./server/config/config')

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
			active = newMember(bases, host, port, name);
	}

	return active;
}

// Returns an array of member description objects.These are the currently known and healthy members.
// sneeze.members()

// Leave the network.You can also leave just by exiting the process - SWIM is designed to handle that.This method is just to give you extra control.
// sneeze.leave()

// This public member variable is null until the instance sucessfully joins a network.It is descriptive object containing meta data about this instance.
// sneeze.info


exports.getLocalState = (swim) => {
	// swim.members(hasLocal=true, hasFaulty)
}

exports.getWhoAmI = (swim) => {
	// swim.whoami()
}

exports.getMembers = (swim) => {
	// swim.members(hasLocal=false, hasFaulty)
}

exports.updateLocalState = (swim) => {
	// swim.updateMeta(meta)
}

exports.joinCluster = (swim) => {
	// swim.join(hosts, callback)
}

exports.leaveCluster = (swim) => {
	// swim.leave()
}

// -----> Helper Functions <-----

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

	base = sneeze(opts);

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
}

// TODO: Change this to monitor settings or remove
const newDisplay = (bases, host, port, name) => {
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
}

// var swim = new Swim(opts);
// swim.bootstrap(config.cluster.hostsToJoin);

// // bootstrap error handling
// swim.on(Swim.EventType.Error, function onError(err) {
// 	console.log(err);
// });

// // bootstrap ready
// swim.on(Swim.EventType.Ready, function onReady() {
// 	console.log(swim.whoami());
// 	console.log(swim.members());
// 	console.log(swim.checksum());
// 	console.log("");
// });

// // change in membership (new node or node died/left)
// swim.on(Swim.EventType.Change, function onChange(update) {
// 	console.log(swim.whoami() + " has changed: " + update)
// });

// // update in membership (node recovered or update on meta data)
// swim.on(Swim.EventType.Update, function onUpdate(update) {
// 	console.log(swim.whoami() + " has updated: " + update.meta.application)
// 	console.log("")
// });

// setTimeout(function () {
// 	var meta = {
// 		'state': 'dog'
// 	};

// 	swim.updateMeta(meta)
// }, 10000);