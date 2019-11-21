// NOTE: BASE

const peer = new Peer('base', {
	host: 'localhost',
	port: 9000,
	path: '/'
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
		console.log("change");
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

	setTimeout(startStreamCycle, 5000);
}

peer.on('call', call => {
	const startChat = async () => {
		call.answer();
		
		call.on('stream', (remoteStream) => {
			document.querySelector('video#remote').srcObject = remoteStream
		});
	}

	startChat();
});
