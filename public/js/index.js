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
	stream1: "head",
	stream2: "torso",
	stream3: "arms",
	stream4: "legs"
};

const wsavcs = {
	wsavc_1: {},
	wsavc_2: {},
	wsavc_3: {},
	wsavc_4: {}
}

const wsUrl = `ws://${BASE_URL}:${BASE_PORT}`;

let ready = false;
let localStream;
let net;
let videoElement;


// NOTE: -----> Setup System <-----

setTimeout(() => setup(), 1000);
setTimeout(() => loadStreams("stream1", hiddenCanvas_1), 5000);
// setTimeout(() => loadStreams("stream2", hiddenCanvas_2), 10000);
// setTimeout(() => loadStreams("stream3", hiddenCanvas_3), 15000);
// setTimeout(() => {
// 		ready = true
// 		loadStreams("stream4", hiddenCanvas_4)
// 	}
// , 20000);

setTimeout(() => {
		ready = true
		loadStreams("stream2", hiddenCanvas_2)
	}
, 10000);

// setTimeout(() => {
// 	ready = true;
// 	loadStreams("stream1", hiddenCanvas_1);
// }, 3000);

// NOTE: -----> Setup Streams <-----

async function setup() {
	const uriStream_1 = "ws://stream1.local:8080";
	const uriStream_2 = "ws://stream2.local:8080";
	const uriStream_3 = "ws://stream3.local:8080";
	const uriStream_4 = "ws://stream4.local:8080";

	wsavcs.wsavc_1 = new WSAvcPlayer(hiddenCanvas_1, "webgl", 1, 35);
	wsavcs.wsavc_2 = new WSAvcPlayer(hiddenCanvas_2, "webgl", 1, 35);
	// wsavcs.wsavc_3 = new WSAvcPlayer(hiddenCanvas_3, "webgl", 1, 35);
	// wsavcs.wsavc_4 = new WSAvcPlayer(hiddenCanvas_4, "webgl", 1, 35);

	wsavcs.wsavc_1.connect(uriStream_1);
	wsavcs.wsavc_2.connect(uriStream_2);
	// wsavcs.wsavc_3.connect(uriStream_3);
	// wsavcs.wsavc_4.connect(uriStream_4);

	hiddenCanvas_1.getContext('webgl');
	hiddenCanvas_2.getContext('webgl');
	// hiddenCanvas_3.getContext('webgl');
	// hiddenCanvas_4.getContext('webgl');

	net = await bodyPix.load();
}


// NOTE: -----> Start Streams (Bootstrap) <-----

async function loadStreams(id, cvs) {
	let w = "wsavc_" + id.charAt(id.length - 1)
	
	wsavcs[w].playStream();

	let remoteStream = cvs.captureStream();

	let vid = videos[id];

	vid.srcObject = remoteStream;

	await videoReady(vid);

	if (ready) {
		setTimeout(() => bootstrap(), 5000);
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
	runNet("stream1", );
	runNet("stream2");
	runNet("stream3");
	runNet("stream4");
}

// NOTE: -----> BodyPix Segmentation <-----

async function runNet(streamId) {
	let vid = videos[streamId];
	let part = state[streamId];

	let segmentation = await newSegment(vid);

	if (part == "arms") {
		renderSegment(segmentation, vid, "rightArm");
		renderSegment(segmentation, vid, "leftArm");
	} else {
		renderSegment(segmentation, vid, part);
	}

	runNet(streamId);
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
			return {};
	}
}

function createMask(segmentation, colors) {
	return bodyPix.toColoredPartMask(segmentation, colors);
}

// NOTE: -----> Web Socket actions <-----

let wsPatchBoard = new WebSocket(wsUrl);

wsPatchBoard.onerror = function () {
	console.log("Fox - that's one of ours!");
};

wsPatchBoard.onopen = function () {
	console.log("The hatches are open!");
};

wsPatchBoard.onclose = function () {
	console.log("The hatches are closed!");
	wsPatchBoard = null;
};

wsPatchBoard.onmessage = function (event) {
	const { streamName, partName } = JSON.parse(event.data);
	
	handleMessage(streamName, partName);
};

const handleMessage = (streamName, partName) => {
	console.log(`Stream "${streamName}" is being segmented for: ${partName}`);

	switch (streamName) {
		case "stream1":	
			state.stream1 = partName ;
			return;
		case "stream2":	
			state.stream2 = partName;
			return;
		case "stream3":	
			state.stream3 = partName;
			return;
		case "stream4":	
			state.stream = partName;
			return;
		default:
			console.log("Patch Board asked for an invalid change")
			return;
	}
}