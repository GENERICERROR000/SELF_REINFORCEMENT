// NOTE: MEMBER

const peer = new Peer({
	host: '192.168.1.182',
	port: 3000,
	path: '/peer'
});

// Connect to base and let it know this member exists
peer.connect('base');

peer.on('connection', (conn) => {
	startChat();
});

async function startChat() {
	const localStream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true
	});
	
	document.querySelector('video#local').srcObject = localStream;
	
	const call = peer.call('base', localStream);
	console.log("stream start");

	call.on('close', () => {
		console.log("stream end");
	});
}



