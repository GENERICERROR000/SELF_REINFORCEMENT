// NOTE: BASE

// TODO: What to do if lose a member - remove from array!

let members = [];
let member;
let index = 0;
let oldCall;

const peer = new Peer('base', {
	host: '10.18.71.244',
	port: 3000,
	path: '/peer'
});

// Check for members. If any, start stream cycle
memberAvailable();

peer.on('connection', (conn) => {
	members.push(conn.peer)
});

function memberAvailable() {
	if (members.length > 0) {
		console.log("member checked in");
		startStream();
	} else {
		setTimeout(memberAvailable, 5000);
	}
}

function startStream() {
	if (oldCall) {
		oldCall.close();
	}

	if (members.length < index + 1) {
		index = 0;
		member = members[index];
		console.log("streaming from:", member)
	} else {
		member = members[index];
		console.log("streaming from:", member)
		index++;
	}

	peer.connect(member);
	setTimeout(memberAvailable, 5000);
	// setTimeout(startStream, 5000);
}

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

peer.on('error', function (err) {
	if (err.type == "peer-unavailable" && members.length > 0) {
		members = members.filter(e => e !== member);
		index = 0;
		console.log("peer unavailable:", member);
		console.log("resetting index");
	}
});