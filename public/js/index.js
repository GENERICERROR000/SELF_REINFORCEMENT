const outputStride = 16;
const segmentationThreshold = 0.5;
const opacity = 1;
const flipHorizontal = true;
const maskBlurAmount = 0;

const canvases = {
	head: document.getElementById('head'),
	torso: document.getElementById('torso'),
	rightArm: document.getElementById('right-arm'),
	leftArm: document.getElementById('left-arm'),
	legs: document.getElementById('legs')
};

// TODO: streams, streamsForSeg, and state, and wsavcs can all be the same object

const streams = {
	stream1: document.getElementById('stream1'),
	stream2: document.getElementById('stream2'),
	stream3: document.getElementById('stream3'),
	stream4: document.getElementById('stream4')
};

const streamsForSeg = {
	stream1: {
		stream: document.createElement('canvas'),
		holder: null
	},
	stream2: {
		stream: document.createElement('canvas'),
		holder: null
	},
	stream3: {
		stream: document.createElement('canvas'),
		holder: null
	},
	stream4: {
		stream: document.createElement('canvas'),
		holder: null
	}
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
setTimeout(() => loadStreams("stream1"), 5000);
// setTimeout(() => loadStreams("stream2"), 10000);
// setTimeout(() => loadStreams("stream3"), 15000);
// setTimeout(() => {
// 		ready = true
// 		loadStreams("stream4")
// 	}
// , 20000);

setTimeout(() => {
		ready = true
		loadStreams("stream1")
	}
, 10000);

// NOTE: -----> Setup Streams <-----

async function setup() {
	const uriStream_1 = "ws://stream1.local:8080";
	const uriStream_2 = "ws://stream2.local:8080";
	const uriStream_3 = "ws://stream3.local:8080";
	const uriStream_4 = "ws://stream4.local:8080";

	streams.stream1.getContext('2d');
	streams.stream2.getContext('2d');
	streams.stream3.getContext('2d');
	streams.stream4.getContext('2d');

	// fitToContainer(streams.stream1);
	// fitToContainer(streams.stream2);
	// fitToContainer(streams.stream3);
	// fitToContainer(streams.stream4);

	// fitToContainer(canvases.head, true);
	// fitToContainer(canvases.torso, true);
	// fitToContainer(canvases.rightArm, true);
	// fitToContainer(canvases.leftArm, true);
	// fitToContainer(canvases.legs, true);

	// wsavcs.wsavc_1 = new WSAvcPlayer(streams.stream1, "2d");
	// wsavcs.wsavc_2 = new WSAvcPlayer(streams.stream2, "2d");
	// wsavcs.wsavc_3 = new WSAvcPlayer(streams.stream3, "2d");
	// wsavcs.wsavc_4 = new WSAvcPlayer(streams.stream4, "2d");

	streamsForSeg.stream1.holder = new WSAvcPlayer(streamsForSeg.stream1.stream, "2d");
	streamsForSeg.stream2.holder = new WSAvcPlayer(streamsForSeg.stream2.stream, "2d");
	// streamsForSeg.stream3.holder = new WSAvcPlayer(streamsForSeg.stream3.stream, "2d");
	// streamsForSeg.stream4.holder = new WSAvcPlayer(streamsForSeg.stream4.stream, "2d");

	// wsavcs.wsavc_1.connect(uriStream_1);
	// wsavcs.wsavc_2.connect(uriStream_2);
	// wsavcs.wsavc_3.connect(uriStream_3);
	// wsavcs.wsavc_4.connect(uriStream_4);

	streamsForSeg.stream1.holder.connect(uriStream_1);
	streamsForSeg.stream2.holder.connect(uriStream_2);
	// streamsForSeg.stream3.holder.connect(uriStream_3);
	// streamsForSeg.stream4.holder.connect(uriStream_4);

	net = await bodyPix.load();
}

function fitToContainer(canvas, t) {
	canvas.style.width = '100%';
	canvas.style.height = '100%';

	if (t) {
		canvas.width = 1280;
		canvas.height = 720;
	} else {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	}
}

// NOTE: -----> Start Streams (Bootstrap) <-----

async function loadStreams(id) {
	let w = "wsavc_" + id.charAt(id.length - 1)
	
	// wsavcs[w].playStream();
	streamsForSeg[id].holder.playStream();

	if (ready) {
		setTimeout(() => bootstrap(), 5000);
	}
}

const width = 1280;
const height = 720;

async function bootstrap() {
	console.log("bootstrapping segmentation")
	runNet();
	// runNet("stream1");
	// runNet("stream2");
	// // runNet("stream3");
	// // runNet("stream4");
}

function createResultTensorForPart(partToSegment, partSegmentationsAndImages) {
	return tf.tidy(() => {
		const initial = tf.zeros([
			height, width, 3
		], 'int32');

		const result = partSegmentationsAndImages.reduce(
			(result, partSegmentationsAndImage, i) => {
				const partForStream = state[`stream${i +1}`];

				if ((partForStream == partToSegment) || ((partToSegment == 'leftArm' || partToSegment == 'rightArm') && partForStream == 'arms')) {
					const mask = buildMaskForPart(partToSegment, partSegmentationsAndImage.partSegmentation);

					const depthDimension = 2;

					const expandedMask = tf.expandDims(mask, depthDimension);

					const image = partSegmentationsAndImage.image;
					const maskedImage = image.mul(expandedMask);

					const newResult = result.add(maskedImage);

					return newResult;
				} else {
					return result;
				}
		}, initial);

		return result;
	});
}

const partIdsForPart = {
	'head': [0, 1],
	'torso': [12, 13],
	'leftArm': [2, 3, 6, 7, 10],
	'rightArm': [4, 5, 8, 9, 11],
	'legs': [14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
};

function buildMaskForPart(part, partSegmentation) {
	const partIdArr = partIdsForPart[part];

	return tf.tidy(() => {
		// todo: get list of part ids for this part, and multiply masks for each part id and return that;

		let res;
		partIdArr.forEach(partId => {
			if (res) {
				res = tf.add(res, tf.equal(partSegmentation, partId))
			} else {
				res = tf.equal(partSegmentation, partId)
			}

		})

		return res
	});
}

const numberOfStreams = 2;
function getPartSegmentationsByImage() {
	return tf.tidy(() => {
		const partSegmentationsAndImages = [];
 
		for (let i = 0; i < numberOfStreams; i++) {
			const stream = streamsForSeg[`stream${i +1}`].stream
			const image = tf.browser.fromPixels(stream);

			const {
				partSegmentation
			} = net.segmentPersonPartsActivation(image, 0.5);

			partSegmentationsAndImages.push({
				image,
				partSegmentation
			});
			
		}

		return partSegmentationsAndImages;
	});
}

// NOTE: -----> BodyPix Segmentation <-----

// async function runNet(streamId) {
async function runNet() {
	const finalResult = tf.tidy(() => {
		const partSegmentationsAndImages = getPartSegmentationsByImage();

		const resultsPartTensors = ['head', 'torso', 'leftArm', 'rightArm', 'legs'].map(
			part => createResultTensorForPart(part, partSegmentationsAndImages)
		);

		const result = tf.concat3d(resultsPartTensors, axis = 1);

		const resized = tf.image.resizeBilinear(result, [600, 800]);

		return resized;
	})

	await tf.browser.toPixels(finalResult, document.getElementById('maincanvas'));
	
	// let vid = streamsForSeg[streamId].stream;
	// let part = state[streamId];

	// let segmentation = await newSegment(vid);

	// if (part == "arms") {
	// 	renderSegment(segmentation, vid, "rightArm");
	// 	renderSegment(segmentation, vid, "leftArm");
	// } else {
	// 	renderSegment(segmentation, vid, part);
	// }

	// runNet(streamId);
	runNet();
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

// NOTE: -----> Web Socket Actions <-----

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
			break;
		case "stream2":	
			state.stream2 = partName;
			break;
		case "stream3":	
			state.stream3 = partName;
			break;
		case "stream4":	
			state.stream = partName;
			break;
		default:
			console.log("Patch Board asked for an invalid change")
			break;
	}
}