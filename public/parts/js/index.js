// NOTE: BODY PARTS

const url = window.location;
const urlObject = new URL(url);
const id = urlObject.searchParams.get('id')
const partColors = urlObject.searchParams.get('part')

const outputStride = 16;
const segmentationThreshold = 0.5;

const canvas = document.getElementById('canvas');
// const opacity = 1;
const opacity = 0.8;
const flipHorizontal = true;
const maskBlurAmount = 0;

let localStream;
let net;
let videoElement;

// -----> Create New Peer - Opinion <-----

// const peer = new Peer(id, {
// 	host: BASE_URL,
// 	port: BASE_PORT,
// 	path: '/api/peer'
// });

// -----> Startup <-----

bootstrap();

async function bootstrap() {
	videoElement = await setupCamera();

	net = await bodyPix.load();

	runNet();
}

async function setupCamera() {
	const opts = {
		audio: false,
		video: true
	};

	const vidEl = document.getElementById('local');

	vidEl.srcObject = await navigator.mediaDevices.getUserMedia(opts);

	return new Promise((resolve) => {
		vidEl.onloadedmetadata = () => {
			vidEl.width = vidEl.videoWidth;
			vidEl.height = vidEl.videoHeight;
			resolve(vidEl);
		};
	});
}

// -----> ML Segmentation <-----

async function runNet() {	
	let segmentation = await newSegment();

	colorParts(segmentation);

	runNet();
}

async function newSegment() {
	let newSegmentation = await net.segmentPersonParts(videoElement, outputStride, segmentationThreshold);
	
	return newSegmentation;
}

function colorParts(segmentation) {
	const coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS[partColors]);

	bodyPix.drawMask(canvas, videoElement, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
}

// -----> Stream Camera <-----

// Connect to base and let it know this member exists
// peer.connect('display');

// When display connects, send stream of local camera
// peer.on('connection', (conn) => {
// 	const call = peer.call('display', videoElement.srcObject);
// 	console.log("stream start");

// 	call.on('close', () => {
// 		console.log("stream end");
// 	});
// });
