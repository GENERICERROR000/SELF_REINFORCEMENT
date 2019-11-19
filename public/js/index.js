let net;
let video;
let segmentation;
let img;
let carl = 0

// const options = {
// 	flipHorizontal: false,
// 	outputStride: 8,
// 	internalResolution: 'medium',
// 	segmentationThreshold: 0.5
// }

// arguments for estimating body part segmentation.
const outputStride = 16;
const segmentationThreshold = 0.5;

async function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(400, 400);

	// load up your video
	video = await createCapture(VIDEO, startNet);
	video.size(width, height);
	// video.hide(); // Hide the video element, and just show the canvas

	// Create a palette - uncomment to test below
	// createRGBPalette();
}

async function startNet() {
	net = await bodyPix.load();
	let segmentation = await net.segmentPersonParts(video.elt, outputStride, segmentationThreshold)
	gotResults(false, segmentation)
}

async function gotResults(err, result) {
	if (err) {
		console.log(err)
		return
	}

	segmentation = result;

	if (carl == 0) {
		console.log(segmentation)
		carl = 1
	} 

	// background(255, 0, 0);
	// image(video, 0, 0, width, height)
	// image(segmentation.partMask, 0, 0, width, height)

	let newSegmentation = await net.segmentPersonParts(video.elt, outputStride, segmentationThreshold)
	gotResults(false, newSegmentation)
}

function createRGBPalette() {
	colorMode(RGB);
	options.palette = bodypix.config.palette;
	Object.keys(options.palette).forEach(part => {
		const r = floor(random(255));
		const g = floor(random(255));
		const b = floor(random(255));
		const c = color(r, g, b)
		options.palette[part].color = c;
	});
}
