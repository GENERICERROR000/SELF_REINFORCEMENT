// async function loadAndUseBodyPix() {
// 	const net = await bodyPix.load();
// 	console.log("bodypix loaded")
// }

// loadAndUseBodyPix()

// const imageElement = document.getElementById('image');

// // load the BodyPix model from a checkpoint
// const net = await bodyPix.load();

// // arguments for estimating body part segmentation.
// const outputStride = 16;
// const segmentationThreshold = 0.5;

// // load the person segmentation model from a checkpoint
// const net = await bodyPix.load();

// const partSegmentation = await net.estimatePartSegmentation(imageElement, outputStride, segmentationThreshold);

let bodypix;
let video;
let segmentation;
let img;
let carl = 0

// async function loadAndUseBodyPix() {
// 	bodypix = await bodyPix.load();
// 	console.log("bodypix loaded");
// }
// loadAndUseBodyPix()

// const options = {
// 	outputStride: 8, // 8, 16, or 32, default is 16
// 	segmentationThreshold: 0.3, // 0 - 1, defaults to 0.5 
// }

const options = {
	flipHorizontal: false,
	internalResolution: 'medium',
	segmentationThreshold: 0.7
}

// function preload() {
// 	// bodypix = ml5.bodyPix(options)
// }

async function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(400, 400);

	// load up your video
	video = await createCapture(VIDEO);
	video.size(width/2, height/2);
	// video.hide(); // Hide the video element, and just show the canvas

	// Create a palette - uncomment to test below
	// createHSBPalette();
	// createRGBPalette();
	// createSimplePalette();

	// bodypix.segmentWithParts(video, gotResults, options)
	bodypix = await bodyPix.load();
	console.log(video.elt)
	let segmentation = await bodypix.segmentPersonParts(video.elt, options)
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

	bodypix.segmentWithParts(video, gotResults, options)

	let newSegmentation = await bodypix.segmentPersonParts(video, options)
	gotResults(false, newSegmentation)
}

// function createSimplePalette() {
// 	options.palette = bodypix.config.palette;
// 	Object.keys(bodypix.palette).forEach(part => {
// 		const r = floor(random(255));
// 		const g = floor(random(255));
// 		const b = floor(random(255));
// 		options.palette[part].color = [r, g, b]
// 	});
// }

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

// function createHSBPalette() {
// 	colorMode(HSB);
// 	options.palette = bodypix.config.palette;
// 	Object.keys(options.palette).forEach(part => {
// 		const h = floor(random(360));
// 		const s = floor(random(100));
// 		const b = floor(random(100));
// 		const c = color(h, s, b)
// 		options.palette[part].color = c;
// 	});
// }
