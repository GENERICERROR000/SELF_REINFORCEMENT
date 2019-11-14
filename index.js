const app = require('./server/app')

const config = {
	'port': process.env.API_PORT || 3001
}

// ----------> Init Server <----------
app.listen(config.port, (err) => {
	if (err) console.log('Something went wrong', err)
	console.log(`Server started on port ${config.port}...`)
})