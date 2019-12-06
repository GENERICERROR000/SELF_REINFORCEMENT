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

const peer = new Peer('display', {
	// host: "10.18.71.244",
	host: "192.168.1.182",
	// host: BASE_URL,
	port: BASE_PORT,
	path: '/api/peer'
});

// -----> Startup <-----

// bootstrap();

async function bootstrapPart(vid, id) {
	net = await bodyPix.load();

	runNet(vid, id);
}

// -----> ML Segmentation <-----

async function runNet(vid, id) {
	let segmentation = await newSegment(vid);

	colorParts(segmentation, vid, id);

	runNet(vid, id);
}

async function newSegment(vid) {
	let newSegmentation = await net.segmentPersonParts(vid, outputStride, segmentationThreshold);

	return newSegmentation;
}

function colorParts(segmentation, vid, id) {
	let coloredPartImage;

	switch (id) {
		case "1":
			coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['HEAD']);
			break;

		case "2":
			coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['BODY']);
			break;

		case "3":
			coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['RIGHT_ARM']);
			break;
	
		case "4":
			coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['LEFT_ARM']);
			break;
	
		case "5":
			coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['RIGHT_LEG']);
			break;
	
		case "6":
			coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['LEFT_LEG']);
			break;
	
		default:
			coloredPartImage = bodyPix.toColoredPartMask(segmentation, BODY_COLORS['DEFAULT_COLORS']);
			break;
	}

	bodyPix.drawMask(canvases["c"+id], vid, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
}

// -----> Define Peer Events <-----

// When receive a stream, display in 
peer.on('call', (call) => {
	console.log("client connected:", call.peer)
	call.answer();

	call.on('stream', (remoteStream) => handleStream(remoteStream, call.peer));
	call.on('close', () => console.log("closing stream from:", call.peer));
	call.on('error', (err) => console.log(err));
});

async function handleStream(remoteStream, id) {
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
