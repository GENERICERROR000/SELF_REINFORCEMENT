'use strict'
const port = require('./server/config/config').port
const server = require('./server/src/server')
const startPatchBoard = require('./server/src/patch_board')

// NOTE: -----> Start Server <-----

server.listen(port, (err) => {
	if (err) {
		console.log('Something went wrong', err);
	}

	console.log(`Server started on port ${port}...`);

	const wss = new WebSocket.Server({
		server
	});

	startPatchBoard(wss)
})
