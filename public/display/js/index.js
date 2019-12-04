// NOTE: DISPLAY

const outputStride = 16;
const segmentationThreshold = 0.5;

const opacity = 1;
const flipHorizontal = true;
const maskBlurAmount = 0;

let localStream;
let net;
let videoElement;

const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const c3 = document.getElementById('c3');
const c4 = document.getElementById('c4');
const c5 = document.getElementById('c5');
const c6 = document.getElementById('c6');

const v1 = document.getElementById('v1');
const v2 = document.getElementById('v2');
const v3 = document.getElementById('v3');
const v4 = document.getElementById('v4');
const v5 = document.getElementById('v5');
const v6 = document.getElementById('v6');

// -----> Create New Peer - Display <-----

const peer = new Peer('display', {
	host: BASE_URL,
	port: BASE_PORT,
	path: '/api/peer'
});

// -----> Startup <-----

// bootstrap();

async function bootstrap() {
	net = await bodyPix.load();

	runNet();
}

// -----> ML Segmentation <-----

async function runNet() {
	let segmentation = await newSegment();

	colorParts(segmentation);

	runNet();
}

async function newSegment() {
	let newSegmentation = await net.segmentPersonParts(v1, outputStride, segmentationThreshold);

	return newSegmentation;
}

function colorParts(segmentation) {
	const coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['HEAD']);

	bodyPix.drawMask(c1, v1, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
}

// -----> Define Peer Events <-----

// peer.on('connection', (conn) => {
	
// });

// When receive a stream, display in 
peer.on('call', (call) => {
	console.log("client connected")
	startChat();

	function startChat() {
		call.answer();

		call.on('stream', async (remoteStream) => {
			v1.srcObject = remoteStream;
			
			await videoReady(v1);

			bootstrap();
		});

		call.on('close', () => {
			console.log("closing stream from:", call.peer);
		});
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
