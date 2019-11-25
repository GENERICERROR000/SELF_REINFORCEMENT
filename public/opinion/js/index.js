// NOTE: OPINION

const outputStride = 16;
const segmentationThreshold = 0.5;

let localStream;
let net;
let img;
let videoElement;
let carl = 0; // WARN: Remove when dev is done

// -----> Create New Peer - Opinion <-----

const peer = new Peer({
	host: PEER_SERVER,
	port: PEER_PORT,
	path: '/api/peer'
});

// -----> ML Segmentation <-----

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
	newOpinion(false, segmentation);

	// Connect to base and let it know this member exists
	peer.connect('display');
}

// TODO: This name is wrong because Fn also calls for score - rethink sequence here
async function newOpinion(err, segmentation) {
	if (err) {
		console.log(err);
		return;
	}

	if (carl == 0) {
		// TODO: CALL FETCH HERE FOR TESTING
		console.log(segmentation);
		if (segmentation.allPoses[0]) {
			postScores(segmentation.allPoses[0])
		}

		carl = 1;
	}

	let newSegmentation = await net.segmentPersonParts(videoElement, outputStride, segmentationThreshold);
	newOpinion(false, newSegmentation); // TODO: calling this should be done by a set timeout
}

// TODO: MAKE THIS FN YO!
async function postScores(scores) {
	const URL = 'https://' + BASE_URL + ':' + BASE_PORT + '/api/opinion'
	const fetchOptions = {
		method: 'POST',
		body: JSON.stringify(scores),
	 	headers: {
	 		'Content-Type': 'application/json'
	 	}
	};

	const res = await fetch(URL, fetchOptions);
	console.log('New opinions sent');
}

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
