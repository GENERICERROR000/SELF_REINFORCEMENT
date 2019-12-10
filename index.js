'use strict'
const port = require('./server/config/config').port
const server = require('./src/server')
const patchBoard = require('./src/patch_board')

// NOTE: -----> Start WebSockets  <-----

const wss = new WebSocket.Server({
	server
});

// NOTE: -----> Start WebSockets  <-----

// patchBoard.something(wss)

// NOTE: -----> Start Server <-----

server.listen(port, (err) => {
	if (err) console.log('Something went wrong', err);
	console.log(`Server started on port ${port}...`);
})

server.listen(8080);