// NOTE: DISPLAY

const outputStride = 16;
const segmentationThreshold = 0.5;

const opacity = 1;
const flipHorizontal = true;
const maskBlurAmount = 0;

let localStream;
let net;
let videoElement;

const canvases = {
	c1: document.getElementById('c1'),
	c2: document.getElementById('c2'),
	c3: document.getElementById('c3'),
	c4: document.getElementById('c4'),
	c5: document.getElementById('c5'),
	c6: document.getElementById('c6')
}

const videos = {
	v1: document.getElementById('v1'),
	v2: document.getElementById('v2'),
	v3: document.getElementById('v3'),
	v4: document.getElementById('v4'),
	v5: document.getElementById('v5'),
	v6: document.getElementById('v6')
}

// -----> Create New Peer - Display <-----

// const peer = new Peer('display', {
// 	// host: "10.18.71.244",
// 	host: "192.168.1.182",
// 	// host: BASE_URL,
// 	port: BASE_PORT,
// 	path: '/api/peer'
// });

// -----> Startup <-----

async function bootstrapPart(vid, id) {
	net = await bodyPix.load();

	runNet(vid, id);
}

// -----> ML Segmentation <-----

async function runNet(vid, id) {
	let segmentation = await newSegment(vid);

	renderSegment(segmentation, vid, id);

	runNet(vid, id);
}

async function newSegment(vid) {
	let newSegmentation = await net.segmentPersonParts(vid, outputStride, segmentationThreshold);

	return newSegmentation;
}

function renderSegment(segmentation, vid, id) {
	let coloredPartImage = whichColor(segmentation, id);

	bodyPix.drawMask(canvases["c"+id], vid, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
}

function whichColor(segmentation, id) {
	switch (id) {
		case 1:
			return createMask(segmentation, BODY_COLORS['HEAD']);

		case 2:
			return createMask(segmentation, BODY_COLORS['BODY']);

		case 3:
			return createMask(segmentation, BODY_COLORS['RIGHT_ARM']);

		case 4:
			return createMask(segmentation, BODY_COLORS['LEFT_ARM']);

		case 5:
			return createMask(segmentation, BODY_COLORS['RIGHT_LEG']);

		case 6:
			return createMask(segmentation, BODY_COLORS['LEFT_LEG']);

		default:
			return createMask(segmentation, BODY_COLORS['DEFAULT_COLORS']);
	}
}

function createMask(segmentation, colors) {
	return bodyPix.toColoredPartMask(segmentation, colors);
}

// -----> Define Peer Events <-----

// When receive a stream, display in 
// peer.on('call', (call) => {
// 	console.log("client connected:", call.peer)
// 	call.answer();

// 	call.on('stream', (remoteStream) => handleStream(remoteStream, call.peer));
// 	call.on('close', () => console.log("closing stream from:", call.peer));
// 	call.on('error', (err) => console.log(err));
// });


// var canvas1 = document.getElementById('c1')
var canvas1 = document.createElement("canvas");
var uri = "ws://10.23.10.34:8080"
var wsavc = new WSAvcPlayer(canvas1, "webgl", 1, 35);
wsavc.connect(uri);

setTimeout(() => startit(), 2000);
setTimeout(() => handleStream(1), 3000);
setTimeout(() => handleStream(2), 4000);
setTimeout(() => handleStream(3), 5000);

function startit() {
	wsavc.playStream();
	// var ctx = canvas1.getContext('webgl');
	canvas1.getContext('webgl');
}

async function handleStream(id) {
// async function handleStream(remoteStream, id) {
	// wsavc.playStream();
	// // var ctx = canvas1.getContext('webgl');
	// canvas1.getContext('webgl');
	
	var remoteStream = canvas1.captureStream();

	let vid = videos["v"+id];

	vid.srcObject = remoteStream;

	await videoReady(vid);

	bootstrapPart(vid, id);
}

function videoReady(vidEl) {
	return new Promise((resolve) => {
		vidEl.onloadedmetadata = () => {
			vidEl.width = vidEl.videoWidth;
			vidEl.height = vidEl.videoHeight;
			resolve(vidEl);
		};
	});
}
