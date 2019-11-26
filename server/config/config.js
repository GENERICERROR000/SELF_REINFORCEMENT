'use strict'

const name_id = 'member-' + new Date();

module.exports = {
	local: {
		host: process.env.HOST || '127.0.0.1',
		port: process.env.PORT || 3000, 
		mode: process.env.MODE || 'member',
		name: process.env.NAME || name_id,
		id: process.env.ID || name_id
	},
	cluster: {
		bases: (process.env.BASES || '127.0.0.1:3000').split(','),
		peerServer: process.env.PEER_SERVER || '127.0.0.1',
		peerPort: process.env.PEER_PORT || 3000
	}
};
