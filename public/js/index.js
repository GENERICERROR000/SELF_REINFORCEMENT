const bodyCvs = document.getElementById('body');
const wsUrl = 'ws://192.168.1.9:5050';
// const wsUrl = `ws://${BASE_URL}:${BASE_PORT}`;
const heightStream = 360;
const widthStream = 640;

let imageTensors = [];
let ready = false;
let net;

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

const partIdsForPart = {
	'head': [0, 1],
	'torso': [12, 13],
	'leftArm': [2, 3, 6, 7, 10],
	'rightArm': [4, 5, 8, 9, 11],
	'legs': [14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
};

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
		loadStreams("stream2")
	}
, 10000);

// NOTE: -----> Setup Streams <-----

async function setup() {
	// const uriStream_1 = "ws://stream1.local:8080";
	// const uriStream_2 = "ws://stream2.local:8080";
	// const uriStream_3 = "ws://stream3.local:8080";
	// const uriStream_4 = "ws://stream4.local:8080";
	const uriStream_1 = "ws://192.168.1.3:8080";
	const uriStream_2 = "ws://192.168.1.5:8080";
	const uriStream_3 = "ws://192.168.1.6:8080";
	const uriStream_4 = "ws://192.168.1.7:8080";

	streams.stream1.getContext('2d');
	streams.stream2.getContext('2d');
	streams.stream3.getContext('2d');
	streams.stream4.getContext('2d');

	fitToContainer(streams.stream1);
	fitToContainer(streams.stream2);
	fitToContainer(streams.stream3);
	fitToContainer(streams.stream4);

	streamsForSeg.stream1.holder = new WSAvcPlayer(streamsForSeg.stream1.stream, "2d");
	streamsForSeg.stream2.holder = new WSAvcPlayer(streamsForSeg.stream2.stream, "2d");
	// streamsForSeg.stream3.holder = new WSAvcPlayer(streamsForSeg.stream3.stream, "2d");
	// streamsForSeg.stream4.holder = new WSAvcPlayer(streamsForSeg.stream4.stream, "2d");

	streamsForSeg.stream1.holder.connect(uriStream_1);
	streamsForSeg.stream2.holder.connect(uriStream_2);
	// streamsForSeg.stream3.holder.connect(uriStream_3);
	// streamsForSeg.stream4.holder.connect(uriStream_4);

	net = await bodyPix.load({
		architecture: 'ResNet50'
	});
}

function fitToContainer(canvas, t) {
	canvas.style.width = '100%';
	canvas.style.height = '100%';

	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

// NOTE: -----> Start Streams (Bootstrap) <-----

async function loadStreams(id) {
	streamsForSeg[id].holder.playStream();

	if (ready) {
		setTimeout(() => bootstrap(), 5000);
	}
}

async function bootstrap() {
	console.log("bootstrapping segmentation")

	captureStreams();
	runNet();
}

async function captureStreams() {
	const newImageTensors = tf.tidy(() => {
		const result = [];

		for (let i = 0; i < numberOfStreams; i++) {
			const stream = streamsForSeg[`stream${i + 1}`].stream;
			const image = tf.browser.fromPixels(stream);
			result.push(image);
		}

		return result;
	});
	
	if (imageTensors.length > 0) {
		imageTensors.forEach(t => t.dispose());	
	}

	imageTensors = newImageTensors;

	await Promise.all(newImageTensors.map((t, i) => tf.browser.toPixels(t, streams[`stream${i + 1}`])));

	requestAnimationFrame(captureStreams);
}

async function runNet() {
	const finalResult = tf.tidy(() => {
		const partSegmentationsAndImages = getPartSegmentationsByImage();

		const resultsPartTensors = [
			['zero', 'head', 'zero'],
			['leftArm', 'torso', 'rightArm'],
			['zero', 'legs', 'zero']
		];

		const rows = resultsPartTensors.map(
			partGroup => partGroup.map(
				part => createResultTensorForPart(part, partSegmentationsAndImages)
		));

		const asRows = rows.map(elementsInRow => tf.concat3d(elementsInRow, axis=1));

		const stackedVertically = tf.concat3d(asRows, axis=0);

		// const resized = tf.image.resizeBilinear(stackedVertically, [600, 800]);
		const resized = tf.image.resizeBilinear(stackedVertically, [768, 1024]);

		return resized;
	})

	await tf.browser.toPixels(finalResult, bodyCvs);

	finalResult.dispose();

	requestAnimationFrame(runNet);
}

const numberOfStreams = 2;
function getPartSegmentationsByImage() {
	return tf.tidy(() => {
		const partSegmentationsAndImages = [];

		for (let i = 0; i < numberOfStreams; i++) {
			if (imageTensors.length > 0) {
				const image = imageTensors[i];

				const { partSegmentation } = net.segmentPersonPartsActivation(image, 1);

				partSegmentationsAndImages.push({
					image,
					partSegmentation
				});
			}
		}

		return partSegmentationsAndImages;
	});
}

function createResultTensorForPart(partToSegment, partSegmentationsAndImages) {
	return tf.tidy(() => {
		const initial = tf.zeros([heightStream, widthStream, 3], 'int32');

		if (partToSegment == "zero") {
			return initial;
		} else {
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
		}
	});
}

function buildMaskForPart(part, partSegmentation) {
	const partIdArr = partIdsForPart[part];

	return tf.tidy(() => {
		let combinedMask;
		partIdArr.forEach(partId => {
			if (combinedMask) {
				combinedMask = tf.add(combinedMask, tf.equal(partSegmentation, partId));
			} else {
				combinedMask = tf.equal(partSegmentation, partId);
			}
		})

		return combinedMask;
	});
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