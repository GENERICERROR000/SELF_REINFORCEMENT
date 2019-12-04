// NOTE: DISPLAY

const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const c3 = document.getElementById('c3');
const c4 = document.getElementById('c4');
const c5 = document.getElementById('c5');
const c6 = document.getElementById('c6');

let opinions = [];
let opinion;
let index = 0;
let oldCall;

// -----> Create New Peer - Display <-----

const peer = new Peer('display', {
	host: BASE_URL,
	port: BASE_PORT,
	path: '/api/peer'
});

// -----> Startup <-----

// Init
bootstrap();

// Check for opinions, start stream if any
function bootstrap() {

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