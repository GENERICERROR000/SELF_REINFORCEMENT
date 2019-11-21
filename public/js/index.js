let net;
let video;
let segmentation;
let img;
let carl = 0;

// arguments for estimating body part segmentation.
const outputStride = 16;
const segmentationThreshold = 0.5;

async function setup() {
	noCanvas();
	video = await createCapture(VIDEO, startNet);
	video.style('margin', 'auto');
	video.style('width', '400px');
}

async function startNet() {
	net = await bodyPix.load();
	let segmentation = await net.segmentPersonParts(video.elt, outputStride, segmentationThreshold)
	gotResults(false, segmentation)
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
		// console.log(segmentation);

		// media stream for broadcasting
		console.log(video.elt.srcObject);
		// console.log(video);

		carl = 1;
	} 

	let newSegmentation = await net.segmentPersonParts(video.elt, outputStride, segmentationThreshold);
	gotResults(false, newSegmentation);
}