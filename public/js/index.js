const outputStride = 16;
const segmentationThreshold = 0.5;
const opacity = 1;
const flipHorizontal = true;
const maskBlurAmount = 0;

const hiddenCanvas_1 = document.createElement("canvas");
const hiddenCanvas_2 = document.createElement("canvas");
const hiddenCanvas_3 = document.createElement("canvas");
const hiddenCanvas_4 = document.createElement("canvas");

const canvases = {
	head: document.getElementById('head'),
	torso: document.getElementById('torso'),
	rightArm: document.getElementById('right-arm'),
	leftArm: document.getElementById('left-arm'),
	legs: document.getElementById('legs')
};

const videos = {
	stream1: document.getElementById('stream1'),
	stream2: document.getElementById('stream2'),
	stream3: document.getElementById('stream3'),
	stream4: document.getElementById('stream4')
};

const state = {
	head: "stream1",
	torso: "stream2",
	rightArm: "stream3",
	leftArm: "stream3",
	legs: "stream4"
};

const wsUrl = `ws://${BASE_URL}:${BASE_PORT}`;

let ready = false
let localStream;
let net;
let videoElement;

// NOTE: -----> Setup Streams <-----

setup();

function setup() {
	const uriStream_1 = "ws://stream1.local:8080";
	const uriStream_2 = "ws://stream2.local:8080";
	const uriStream_3 = "ws://stream3.local:8080";
	const uriStream_4 = "ws://stream4.local:8080";

	// getStream(uriStream_1, hiddenCanvas_1);
	getStream(uriStream_2, hiddenCanvas_2);
	// getStream(uriStream_3, hiddenCanvas_3);
	// getStream(uriStream_4, hiddenCanvas_4);
}

async function getStream(uri, cvs) {
	const wsavc = new WSAvcPlayer(cvs, "webgl", 1, 35);

	await wsavc.connect(uri);

	wsavc.playStream();

	cvs.getContext('webgl');
}



// NOTE: -----> Start Streams (Bootstrap) <-----

// setTimeout(() => loadStreams("stream1", hiddenCanvas_1), 2000);
// setTimeout(() => loadStreams("stream2", hiddenCanvas_2), 3000);
// setTimeout(() => loadStreams("stream3", hiddenCanvas_3), 4000);
// setTimeout(() => {
// 		ready = true
// 		loadStreams("stream4", hiddenCanvas_4)
// 	}
// , 5000);

setTimeout(() => {
	ready = true
	loadStreams("stream2", hiddenCanvas_2)
}, 2000);

async function loadStreams(id, cvs) {
	let remoteStream = cvs.captureStream();

	let vid = videos[id];

	vid.srcObject = remoteStream;

	await videoReady(vid);

	net = await bodyPix.load();

	if (ready) {
		bootstrap();
	}
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

async function bootstrap() {
	net = await bodyPix.load();

	runNet("head");
	runNet("torso");
	runNet("rightArm");
	runNet("leftArm");
	runNet("legs");
}

// NOTE: -----> BodyPix Segmentation <-----

async function runNet(part) {
	let whichStream = state[part]
	let vid = videos[whichStream]

	let segmentation = await newSegment(vid);

	renderSegment(segmentation, vid, part);

	runNet(part);
}

async function newSegment(vid) {
	let newSegmentation = await net.segmentPersonParts(vid, outputStride, segmentationThreshold);

	return newSegmentation;
}

function renderSegment(segmentation, vid, part) {
	let selectedPart = whichPart(segmentation, part);

	bodyPix.drawMask(selectedPart.cvs, vid, selectedPart.mask, opacity, maskBlurAmount, flipHorizontal);
}

function whichPart(segmentation, part) {
	switch (part) {
		case "head":
			return {
				mask: createMask(segmentation, BODY_COLORS['HEAD']),
				cvs: canvases[part]
			};
		case "torso":
			return {
				mask: createMask(segmentation, BODY_COLORS['TORSO']),
				cvs: canvases[part]
			};
		case "rightArm":
			return {
				mask: createMask(segmentation, BODY_COLORS['RIGHT_ARM']),
				cvs: canvases[part]
			};
		case "leftArm":
			return {
				mask: createMask(segmentation, BODY_COLORS['LEFT_ARM']),
				cvs: canvases[part]
			};
		case "legs":
			return {
				mask: createMask(segmentation, BODY_COLORS['LEGS']),
				cvs: canvases[part]
			};
		default:
			console.log("Something went wrong picking a part")
			return;
	}
}

function createMask(segmentation, colors) {
	return bodyPix.toColoredPartMask(segmentation, colors);
}

// NOTE: -----> Web Socket actions <-----

let ws = new WebSocket(wsUrl);

ws.onerror = function () {
	console.log("Fox - that's one of ours!");
};

ws.onopen = function () {
	console.log("The hatches are open!");
};

ws.onclose = function () {
	console.log("The hatches are closed!");
	ws = null;
};

ws.onmessage = function (event) {
	const { streamName, partName } = JSON.parse(event.data);
	
	handleMessage(streamName, partName);
};

const handleMessage = (streamName, partName) => {
	console.log(`Stream "${streamName}" has been sent to ${partName}`)

	switch (partName) {
		case "head":	
			state.head = streamName;
			return;
		case "torso":	
			state.torso = streamName;
			return;
		case "arms":	
			state.rightArm = streamName;
			state.leftArm = streamName;
			return;
		case "legs":	
			state.legs = streamName;
			return;
		default:
			console.log("Patch Board asked for an invalid change")
			return;
	}
}