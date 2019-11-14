'use strict'
var Swim = require('swim');
var config = require('./server/config/config')

// bases are the ones that are used for connecting to at start. forget needing all the ones at the start.


exports.bootstrap = () => {
	var opts = {
		local: {
			host: config.local.host + ":" + config.local.port,
			meta: {
				'state': 'cat'
			}
		}
	};

	var swim = new Swim(opts);
	swim.bootstrap(config.cluster.hostsToJoin);

	// bootstrap error handling
	swim.on(Swim.EventType.Error, function onError(err) {
		console.log(err);
	});
	
	// bootstrap ready
	swim.on(Swim.EventType.Ready, function onReady() {
		console.log(swim.whoami());
		console.log(swim.members());
		console.log(swim.checksum());
		console.log("");
	});

	// change in membership (new node or node died/left)
	swim.on(Swim.EventType.Change, function onChange(update) {
		console.log(swim.whoami() + " has changed: " + update)
	});

	// update in membership (node recovered or update on meta data)
	swim.on(Swim.EventType.Update, function onUpdate(update) {
		console.log(swim.whoami() + " has updated: " + update.meta.application)
		console.log("")
	});

	// setTimeout(function () {
	// 	var meta = {
	// 		'state': 'dog'
	// 	};

	// 	swim.updateMeta(meta)
	// }, 10000);

	return swim;
}

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