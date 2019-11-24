'use strict'
module.exports = {
	local: {
		host: process.env.HOST || '127.0.0.1',
		port: process.env.PORT || 3000, 
		mode: process.env.MODE || 'member',
		name: process.env.NAME || 'node-' + new Date()
	},
	cluster: {
		bases: (process.env.BASES || '127.0.0.1:3000').split(','),
		peerServer: process.env.PEER_SERVER || '127.0.0.1:3000'
	}
};
