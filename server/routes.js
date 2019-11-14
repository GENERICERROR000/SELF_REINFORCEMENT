var express = require('express')

var router = express.Router();


// Homepage for API
router.get('/asd', (req, res) => res.send("WHY ARE YOU HERE? <br><br> THIS IS THE API HOMEPAGE.  WHY DID I EVEN MAKE THIS!?"));

router.post('/api/v1/sounds/new', (req, res) => saveSound(req, res))\

// // Get All Sounds
// router.get('/api/v1/sounds', (req, res) => getSounds(req, res))

// // Create Sound
// router.post('/api/v1/sounds/new', (req, res) => saveSound(req, res))\

// ----------> Helper Functions <----------

// const getSounds = (req, res) => {
// 	let s3 = new AWS.S3()

// 	let params = {
// 		Bucket: 'media.soundsof.us',
// 		Delimiter: '/',
// 		Prefix: 'audio/'
// 	}

// 	s3.listObjectsV2(params, function (err, data) {
// 		if (err) {
// 			console.error("UNABLE TO LIST BUCKET:", err)
// 		} else {
// 			res.setHeader('Content-Type', 'application/json')
// 			res.end(JSON.stringify(data))
// 		}
// 	})
// }

// const saveSound = (req, res) => {
// 	let buffer = req.file.buffer
// 	let name = `${new Date().getTime()}+--+` + req.file.originalname + ".wav"
// 	let s3 = new AWS.S3()

// 	// Write to file for tests
// 	// let uploadLocation = __dirname + '/../sounds/' + name
// 	// fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(buffer)));

// 	let params = {
// 		Bucket: "media.soundsof.us",
// 		Key: "audio/" + name,
// 		ACL: "public-read",
// 		Body: Buffer.from(new Uint8Array(buffer))
// 	}

// 	s3.upload(params, function (err) {
// 		if (err) {
// 			console.error("UNABLE TO ADD SOUND:", err)
// 		} else {
// 			console.log("SOUND ADDED TO DB AND S3")
// 			res.sendStatus(201)
// 		}
// 	})
// }

module.exports = router;