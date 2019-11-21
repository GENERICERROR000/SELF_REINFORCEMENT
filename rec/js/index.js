// NOTE: BASE

const members = [];
let index = 0;
let oldCall;

const peer = new Peer('base', {
	host: 'localhost',
	port: 3000,
	path: '/peer'
});

// Check for members. If any, start stream cycle
membersAvailable();

peer.on('connection', (conn) => {
	members.push(conn.peer)
});

function membersAvailable() {
	if (members.length > 0) {
		console.log("member checked in");
		startStreamCycle();
	} else {
		setTimeout(membersAvailable, 5000);
	}
}

function startStreamCycle() {
	if (oldCall) {
		oldCall.close();
	}

	let member;

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

	setTimeout(startStreamCycle, 5000);
}

peer.on('call', (call) => {
	oldCall = call
	startChat();

	async function startChat() {
		call.answer();
		
		call.on('stream', (remoteStream) => {
			document.querySelector('video#remote').srcObject = remoteStream
		});
	}
});
