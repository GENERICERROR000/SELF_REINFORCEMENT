'use strict'
const port = require('./server/config/config').local.port
const server = require('./server/server')

server.listen(port, (err) => {
	if (err) console.log('Something went wrong', err);
	console.log(`Server started on port ${port}...`);
})
