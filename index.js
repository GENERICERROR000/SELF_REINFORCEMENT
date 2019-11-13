'use strict';

// var os = require('os');
// var ifaces = os.networkInterfaces();

// Object.keys(ifaces).forEach(function (ifname) {
// 	var alias = 0;

// 	ifaces[ifname].forEach(function (iface) {
// 		if ('IPv4' !== iface.family || iface.internal !== false) {
// 			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
// 			return;
// 		}

// 		if (alias >= 1) {
// 			// this single interface has multiple ipv4 addresses
// 			console.log(ifname + ':' + alias, iface.address);
// 		} else {
// 			// this interface has only one ipv4 adress
// 			console.log(ifname, iface.address);
// 		}
// 		++alias;
// 	});
// });

// en0 192.168.1.101
// eth0 10.0.0.101

var Swim = require('swim');

var opts0 = {
	local: {
		host: '127.0.0.1:8080',
		meta: {
			'application': 'info'
		}
	}
};

var opts1 = {
	local: {
		host: '127.0.0.1:8081',
		meta: {
			'application': 'info'
		}
	}
};

var opts2 = {
	local: {
		host: '127.0.0.1:8082',
		meta: {
			'application': 'info'
		}
	}
};

var swim0 = new Swim(opts0);
var swim1 = new Swim(opts1);
var swim2 = new Swim(opts2);

var hostsToJoin0 = ['127.0.0.1:8081', '127.0.0.1:8082'];
var hostsToJoin1 = ['127.0.0.1:8080', '127.0.0.1:8082'];
var hostsToJoin2 = ['127.0.0.1:8080', '127.0.0.1:8081'];

swim0.bootstrap(hostsToJoin0, function onBootstrap(err) {
	if (err) {
		console.log(err);
		return;
	}

	// ready
	console.log(swim0.whoami());
	console.log(swim0.members());
	console.log(swim0.checksum());
	console.log("-----");

	// change on membership, e.g. new node or node died/left
	swim0.on(Swim.EventType.Change, function onChange(update) {
		console.log(swim0.whoami() + " has changed: " + update)
	});
	// update on membership, e.g. node recovered or update on meta data
	swim0.on(Swim.EventType.Update, function onUpdate(update) {
		console.log(swim0.whoami() + " has updated: " + update.meta.application)
		console.log(swim1.members());
		console.log("-----")
	});
});

swim1.bootstrap(hostsToJoin1, function onBootstrap(err) {
	if (err) {
		console.log(err);
		return;
	}

	// ready
	console.log(swim1.whoami());
	console.log(swim1.members());
	console.log(swim1.checksum());
	console.log("-----");

	// change on membership, e.g. new node or node died/left
	swim1.on(Swim.EventType.Change, function onChange(update) {
		console.log(swim1.whoami() + " has changed: " + update)
	});
	// update on membership, e.g. node recovered or update on meta data
	swim1.on(Swim.EventType.Update, function onUpdate(update) {
		console.log(swim1.whoami() + " has updated: " + update.meta.application)
		console.log(swim1.members());
		console.log("-----")
	});
});

swim2.bootstrap(hostsToJoin2, function onBootstrap(err) {
	if (err) {
		console.log(err);
		return;
	}

	// ready
	console.log(swim2.whoami());
	console.log(swim2.members());
	console.log(swim2.checksum());
	console.log("-----");

	// change on membership, e.g. new node or node died/left
	swim2.on(Swim.EventType.Change, function onChange(update) {
		console.log(swim2.whoami() + " has changed: " + update)
	});
	// update on membership, e.g. node recovered or update on meta data
	swim2.on(Swim.EventType.Update, function onUpdate(update) {
		console.log(swim2.whoami() + " has updated: " + update.meta.application)
		console.log(swim1.members());
		console.log("-----")
	});

	setTimeout(function () {
		var meta = {
			'application': 'carl'
		};

		swim2.updateMeta(meta)
	}, 10000);
});

// meta, host, state, incarnation