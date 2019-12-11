'use strict'
const WebSocket = require('ws');
const port = require('./server/config/config').port
const server = require('./server/src/server')
const startPatchBoard = require('./server/src/patch_board')

let start = true
// NOTE: -----> Start Server <-----

server.listen(port, (err) => {
	if (err) {
		console.log('Something went wrong', err);
	}

	console.log(`Server started on port ${port}...`);

	const wss = new WebSocket.Server({
		server
	});
	if (start) {
		wss.on('connection', (ws) => startPatchBoard(ws));
		start = false;
	}
})
