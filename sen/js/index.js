// NOTE: MEMBER

// TODO: can use random gen instsead of 'member' - check Peer constr.
const peer = new Peer({
	host: '192.168.1.182',
	port: 9000,
	path: '/'
});

// Connect to base and let it know this member exists
peer.connect('base');

peer.on('connection', (conn) => {
	console.log(conn);
	startChat();
});

async function startChat() {
	const localStream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true
	});
	
	document.querySelector('video#local').srcObject = localStream;
	
	const call = peer.call('base', localStream);
}



