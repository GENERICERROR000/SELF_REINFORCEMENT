'use strict'
var app = require('./server/app')
var config = require('./server/config/config')

// init server
app.listen(config.local.port, (err) => {
	if (err) console.log('Something went wrong', err)
	console.log(`Server started on port ${config.local.port}...`)
})