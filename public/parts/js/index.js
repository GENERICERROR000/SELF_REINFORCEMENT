// NOTE: BODY PARTS

const outputStride = 16;
const segmentationThreshold = 0.5;

let localStream;
let net;
let partColors;
let videoElement;

let carl = 0; // WARN: REMOVE

// -----> Create New Peer - Opinion <-----

// const peer = new Peer({
// 	host: BASE_URL,
// 	port: BASE_PORT,
// 	path: '/api/peer'
// });

// -----> ML Segmentation <-----

bootstrap();

async function bootstrap() {
	const url = window.location;
	const urlObject = new URL(url);
	partColors = urlObject.searchParams.get('part')

	videoElement = await setupCamera();

	startNet();
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

async function startNet() {
	net = await bodyPix.load();
	let segmentation = await net.segmentPersonParts(videoElement, outputStride, segmentationThreshold);
	newOpinion(segmentation);

	// Connect to base and let it know this member exists
	// peer.connect('display');
}

async function newOpinion(segmentation) {
	if (carl == 0) {
		console.log(segmentation);

		carl = 1;
	}

	carla(segmentation)

	let newSegmentation = await net.segmentPersonParts(videoElement, outputStride, segmentationThreshold);
	newOpinion(newSegmentation);
}

function carla(seg) {
	// The colored part image is an rgb image with a corresponding color from the
	// rainbow colors for each part at each pixel, and black pixels where there is
	// no part.
	const coloredPartImage = bodyPix.toColoredPartMask(seg, BODY_COLORS["DEFAULT_COLORS"]);

	// const opacity = 0.7;
	const opacity = 1;
	const flipHorizontal = false;
	const maskBlurAmount = 0;
	const canvas = document.getElementById('canvas');
	// const canvas2 = document.getElementById('canvas2');
	// Draw the colored part image on top of the original image onto a canvas.
	// The colored part image will be drawn semi-transparent, with an opacity of
	// 0.7, allowing for the original image to be visible under.
	bodyPix.drawMask(canvas, videoElement, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
}

// -----> Stream Camera <-----

// When display connects, send stream of local camera
// peer.on('connection', (conn) => {
// 	startChat();

// 	async function startChat() {
// 		const call = peer.call('display', videoElement.srcObject);
// 		console.log("stream start");

// 		call.on('close', () => {
// 			console.log("stream end");
// 		});
// 	}
// });
