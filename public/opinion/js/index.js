// NOTE: OPINION

let localStream;
let net;
let img;
let videoElement;
let carl = 0; // WARN: Remove when dev is done

const outputStride = 16;
const segmentationThreshold = 0.5;

// -----> Create New Peer - Opinion <-----

const peer = new Peer({
	host: 'localhost', // TODO: Set on server startup
	port: 3000,
	path: '/api/peer'
});

// -----> ML Segmentation <-----
console.log(BASE_URL)
bootstrap();

async function bootstrap() {
	let opts = {
		audio: false,
		video: true
	};

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
	sendOpinion(false, segmentation);

	// Connect to base and let it know this member exists
	peer.connect('display');
}

// TODO: This name is wrong becuase Fn also calls for score - rethink sequence here
async function sendOpinion(err, segmentation) {
	if (err) {
		console.log(err);
		return;
	}

	if (carl == 0) {
		// segmentation score
		// console.log(segmentation.allPoses[0].keypoints[0].score);
		console.log(segmentation);

		carl = 1;
	}

	let newSegmentation = await net.segmentPersonParts(videoElement, outputStride, segmentationThreshold);
	sendOpinion(false, newSegmentation); // TODO: calling this should be done by a set timeout
}

// TODO: MAKE THIS FN YO!
// async function sendScore(score) {
// 	let fetchOptions = {
// 		method: 'POST',
// 		body: body: JSON.stringify(data) // body data type must match "Content-Type" header,
	//  headers: {
	 	// 'Content-Type': 'application/json'
	//  }
// 	};

// 	let res = await fetch('baseURL', fetchOptions);
// 	console.log(res.status);
// }

// -----> Stream Camera <-----

// When display connects, send stream of local camera
peer.on('connection', (conn) => {
	startChat();

	async function startChat() {
		const call = peer.call('display', videoElement.srcObject);
		console.log("stream start");

		call.on('close', () => {
			console.log("stream end");
		});
	}
});
