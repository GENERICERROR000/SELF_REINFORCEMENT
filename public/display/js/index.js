// NOTE: DISPLAY

let opinions = [];
let opinion;
let index = 0;
let oldCall;

// -----> Create New Peer - Display <-----

const peer = new Peer('display', {
	host: 'localhost', // TODO: Set on server startup
	port: 3000,
	path: '/api/peer'
});

// -----> Start Stream <-----

// Init
opinionAvailable();

// Check for opinions, start stream if any
function opinionAvailable() {
	if (opinions.length > 0) {
		startStream();
	} else {
		setTimeout(opinionAvailable, 5000);
	}
}

// Connect to next opinion, telling it to send a stream
function startStream() {
	if (oldCall) {
		oldCall.close();
	}

	if (opinions.length < index + 1) {
		index = 0;
		opinion = opinions[index];
		console.log("streaming from:", opinion);
	} else {
		opinion = opinions[index];
		index++;
		console.log("streaming from:", opinion);
	}

	peer.connect(opinion);
	setTimeout(opinionAvailable, 5000);
}

// -----> Define Peer Events <-----

// When opinion connects, add it to opinions list
peer.on('connection', (conn) => {
	opinions.push(conn.peer)
	console.log("opinion checked in");
});

// When receive a stream, display in 
peer.on('call', (call) => {
	oldCall = call
	startChat();

	async function startChat() {
		call.answer();
		
		call.on('stream', (remoteStream) => {
			document.querySelector('video#remote').srcObject = remoteStream
		});

		call.on('close', () => {
			console.log("closing stream from:", call.peer);
		});
	}
});

// If lose connection to an opinion, remove it from opinions list
peer.on('error', (err) => {
	if (err.type == "peer-unavailable" && opinions.length > 0) {
		opinions = opinions.filter(e => e !== opinion);
		index = 0;
		console.log("peer unavailable:", opinion);
		console.log("resetting index");
	}
});