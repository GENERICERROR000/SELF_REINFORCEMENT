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

// const state = {
// 	stream1: "head",
// 	stream2: "torso",
// 	stream3: "arms",
// 	stream4: "legs"
// };

const state = {
	"head": "stream1",
	"torso": "stream2",
	"rightArm": "stream3",
	"leftArm": "stream3",
	"legs": "stream4"
};

const wsUrl = `ws://${BASE_URL}:${BASE_PORT}`;

let localStream;
let net;
let videoElement;

// NOTE: -----> Setup Streams <-----

setup();

function setup() {
	const uriStream_1 = "ws://stream1.local:5050";
	const uriStream_2 = "ws://stream2.local:5050";
	const uriStream_3 = "ws://stream3.local:5050";
	const uriStream_4 = "ws://stream4.local:5050";

	// WARN: TODO: What are args 3 and 4?
	const wsavc_1 = new WSAvcPlayer(hiddenCanvas_1, "webgl", 1, 35);
	const wsavc_2 = new WSAvcPlayer(hiddenCanvas_2, "webgl", 1, 35);
	const wsavc_3 = new WSAvcPlayer(hiddenCanvas_3, "webgl", 1, 35);
	const wsavc_4 = new WSAvcPlayer(hiddenCanvas_4, "webgl", 1, 35);

	wsavc_1.connect(uriStream_1);
	wsavc_2.connect(uriStream_2);
	wsavc_3.connect(uriStream_3);
	wsavc_4.connect(uriStream_4);

	wsavc_1.playStream();
	wsavc_2.playStream();
	wsavc_3.playStream();
	wsavc_4.playStream();

	hiddenCanvas_1.getContext('webgl');
	hiddenCanvas_2.getContext('webgl');
	hiddenCanvas_3.getContext('webgl');
	hiddenCanvas_4.getContext('webgl');
}

// NOTE: -----> Start Streams (Bootstrap) <-----

setTimeout(() => initStream(1, hiddenCanvas_1), 2000);
setTimeout(() => initStream(2, hiddenCanvas_2), 3000);
setTimeout(() => initStream(3, hiddenCanvas_3), 4000);
setTimeout(() => initStream(4, hiddenCanvas_4), 5000);

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

	let c = selectCanvas(id);

	bodyPix.drawMask(c, vid, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
}

function selectCanvas(id) {
	let s = "stream" + id

	const state = {
		"head": "stream1",
		"torso": "stream2",
		"rightArm": "stream3",
		"leftArm": "stream3",
		"legs": "stream4"
	};

	switch (id) {
		case 1:
			return canvases.head;

		case 2:
			return canvases.torso;

		case 3:
			return canvases.;

		case 4:
			return canvases.;

		default:
			console.log("Not a valid id");
			return state["stream1"];
	}
}

// WARN: This does not work - needs to return the mask. need to figure out above and below - using state so sockets can cause change
// - What's going on is the id is tied to vid and cvs, so no way to change within the loop
// - Somehow set outside of loop, and have fn in loop ref it (a state...)

function whichColor(segmentation, id) {
	switch (id) {
		case 1:
			createMask(segmentation, BODY_COLORS['HEAD']);
			return;

		case 2:
			createMask(segmentation, BODY_COLORS['TORSO']);
			return;

		case 3:
			createMask(segmentation, BODY_COLORS['RIGHT_ARM']);
			createMask(segmentation, BODY_COLORS['LEFT_ARM']);
			return;

		case 4:
			createMask(segmentation, BODY_COLORS['LEGS']);
			return;

		default:
			console.log("This is id was no good:", id)
			createMask(segmentation, BODY_COLORS['DEFAULT_COLORS']);
			return;
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
	console.log("The hatches are open!");
};

ws.onclose = function () {
	console.log("The hatches are closing!");
	ws = null;
};

// TODO: Handle message from server/patch board
ws.onmessage = function (event) {
	const { streamName, partName } = JSON.parse(event.data);
	
	handleMessage(streamName, partName);
};

const handleMessage = (streamName, partName) => {
	console.log(`Stream "${streamName}" has been `)
	state[streamName] = partName
}