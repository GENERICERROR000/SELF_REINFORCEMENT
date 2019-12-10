const outputStride = 16;
const segmentationThreshold = 0.5;
const opacity = 1;
const flipHorizontal = true;
const maskBlurAmount = 0;

const hiddenCanvas1 = document.createElement("canvas");
const hiddenCanvas2 = document.createElement("canvas");
const hiddenCanvas3 = document.createElement("canvas");
const hiddenCanvas4 = document.createElement("canvas");

const canvases = {
	c1: document.getElementById('c1'),
	c2: document.getElementById('c2'),
	c3: document.getElementById('c3'),
	c4: document.getElementById('c4'),
	c5: document.getElementById('c5')
};

const videos = {
	stream1: document.getElementById('stream1'),
	stream2: document.getElementById('stream2'),
	stream3: document.getElementById('stream3'),
	stream4: document.getElementById('stream4')
};

const wsUrl = `ws://${BASE_URL}:${BASE_PORT}`;

let localStream;
let net;
let videoElement;

// NOTE: -----> Setup Streams <-----

setup();

function setup() {
	const uriStream1 = "ws://stream1.local:5050";
	const uriStream2 = "ws://stream2.local:5050";
	const uriStream3 = "ws://stream3.local:5050";
	const uriStream4 = "ws://stream4.local:5050";

	// WARN: TODO: What are args 3 and 4?
	const wsavc1 = new WSAvcPlayer(hiddenCanvas1, "webgl", 1, 35);
	const wsavc2 = new WSAvcPlayer(hiddenCanvas2, "webgl", 1, 35);
	const wsavc3 = new WSAvcPlayer(hiddenCanvas3, "webgl", 1, 35);
	const wsavc4 = new WSAvcPlayer(hiddenCanvas4, "webgl", 1, 35);

	wsavc1.connect(uriStream1);
	wsavc2.connect(uriStream2);
	wsavc3.connect(uriStream3);
	wsavc4.connect(uriStream4);

	wsavc1.playStream();
	wsavc2.playStream();
	wsavc3.playStream();
	wsavc4.playStream();

	hiddenCanvas1.getContext('webgl');
	hiddenCanvas2.getContext('webgl');
	hiddenCanvas3.getContext('webgl');
	hiddenCanvas4.getContext('webgl');
}

// NOTE: -----> Start Streams (Bootstrap) <-----

setTimeout(() => initStream(1, hiddenCanvas1), 2000);
setTimeout(() => initStream(2, hiddenCanvas2), 3000);
setTimeout(() => initStream(3, hiddenCanvas3), 4000);
setTimeout(() => initStream(4, hiddenCanvas4), 5000);

async function initStream(id, cvs) {
	let remoteStream = cvs.captureStream();

	let vid = videos["stream" + id];

	vid.srcObject = remoteStream;

	await videoReady(vid);

	bootstrap(vid, id);
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

async function bootstrap(vid, id) {
	net = await bodyPix.load();

	runNet(vid, id);
}

// NOTE: -----> BodyPix Segmentation <-----

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

// WARN: TODO: Fix colors to be correct!!!
function whichColor(segmentation, id) {
	switch (id) {
		case 1:
			return createMask(segmentation, BODY_COLORS['HEAD']);

		case 2:
			return createMask(segmentation, BODY_COLORS['BODY']);

		case 3:
			return createMask(segmentation, BODY_COLORS['RIGHT_ARM']);
			return createMask(segmentation, BODY_COLORS['LEFT_ARM']);

		case 4:
			return createMask(segmentation, BODY_COLORS['RIGHT_LEG']);
			return createMask(segmentation, BODY_COLORS['LEFT_LEG']);

		default:
			console.log("This is id was no good:", id)
			return createMask(segmentation, BODY_COLORS['DEFAULT_COLORS']);
	}
}

function createMask(segmentation, colors) {
	return bodyPix.toColoredPartMask(segmentation, colors);
}

// NOTE: -----> Web Socket actions <-----

const ws = new WebSocket(wsUrl);

ws.onerror = function () {
	console.log("Fox - that's one of ours!");
};

ws.onopen = function () {
	console.log("The hatches are open!")
};

ws.onclose = function () {
	console.log("The hatches are closing!")
	ws = null;
};

ws.onmessage = function (event) {
	const data = JSON.parse(event.data);
	
	
};