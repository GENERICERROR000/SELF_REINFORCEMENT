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
	c5: document.getElementById('c5'),
	c6: document.getElementById('c6')
};

const videos = {
	v1: document.getElementById('v1'),
	v2: document.getElementById('v2'),
	v3: document.getElementById('v3'),
	v4: document.getElementById('v4'),
	v5: document.getElementById('v5'),
	v6: document.getElementById('v6')
};

let localStream;
let net;
let videoElement;

// NOTE: -----> Startup <-----

setTimeout(() => setup(), 2000);
setTimeout(() => initStream(1, hiddenCanvas1), 3000);
setTimeout(() => initStream(2, hiddenCanvas2), 4000);
setTimeout(() => initStream(3, hiddenCanvas3), 5000);
setTimeout(() => initStream(4, hiddenCanvas4), 6000);

function setup() {
	const uriStream1 = "ws://10.23.10.34:8080";
	const uriStream2 = "ws://10.23.10.34:8080";
	const uriStream3 = "ws://10.23.10.34:8080";
	const uriStream4 = "ws://10.23.10.34:8080";

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

async function initStream(id, cvs) {
	let remoteStream = cvs.captureStream();

	let vid = videos["v" + id];

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

async function bootstrapPart(vid, id) {
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
			console.log("This is id was no good:", id)
			return createMask(segmentation, BODY_COLORS['DEFAULT_COLORS']);
	}
}

function createMask(segmentation, colors) {
	return bodyPix.toColoredPartMask(segmentation, colors);
}

// NOTE: -----> Change Streams - Web Sockets <-----