'use strict'
module.exports = {
	local: {
		host: process.env.HOST || "127.0.0.1",
		port: process.env.PORT || 8080, 
		isBase: process.env.MODE || 'member',
		isBase: process.env.NAME || 'name'
	},
	cluster: {
		bases: process.env.BASES || ['127.0.0.1:8081', '127.0.0.1:8082']
	}
};

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