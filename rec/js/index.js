// NOTE: BASE

const peer = new Peer('base', {
	host: 'localhost',
	port: 3000,
	path: '/peer'
}) ;

const members = [];
var index = 0

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
	let member = members[index];
	peer.connect(member);

	if (members.length < index + 1) {
		index = 0;
	} else {
		index++;
	}

	// TODO: Close connection to old one
	// TODO: Remove it's id from members array?
	setTimeout(startStreamCycle, 5000);
}

peer.on('call', call => {
	startChat();

	async function startChat() {
		call.answer();
		
		call.on('stream', (remoteStream) => {
			document.querySelector('video#remote').srcObject = remoteStream
		});
	}
});
