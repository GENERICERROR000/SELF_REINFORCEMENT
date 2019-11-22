// NOTE: MEMBER

const peer = new Peer({
	host: '10.18.71.244',
	port: 3000,
	path: '/peer'
});

let net;
let video;
let segmentation;
let img;
let carl = 0;

// -----> ML Segmentation <-----

const outputStride = 16;
const segmentationThreshold = 0.5;

async function setup() {
	noCanvas();
	video = await createCapture(VIDEO, startNet);
	localStream = 
	video.style('margin', 'auto');
	video.style('width', '400px');
}

async function startNet() {
	net = await bodyPix.load();
	let segmentation = await net.segmentPersonParts(video.elt, outputStride, segmentationThreshold)
	gotResults(false, segmentation)

	// Connect to base and let it know this member exists
	peer.connect('base');
}

async function gotResults(err, result) {
	if (err) {
		console.log(err);
		return;
	}

	segmentation = result;

	if (carl == 0) {
		// segmentation score
		// console.log(segmentation.allPoses[0].keypoints[0].score);
		console.log(segmentation);

		// Video Stream object
		// console.log(video.elt.srcObject);
		
		carl = 1;
	}

	let newSegmentation = await net.segmentPersonParts(video.elt, outputStride, segmentationThreshold);
	gotResults(false, newSegmentation);
}

// -----> Stream Camera <-----

peer.on('connection', (conn) => {
	startChat();
});

async function startChat() {
	const call = peer.call('base', video.elt.srcObject);
	console.log("stream start");

	call.on('close', () => {
		console.log("stream end");
	});
}
