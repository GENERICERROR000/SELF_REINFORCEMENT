'use strict'
const config = require('../config/config');

// TODO: Need to create the following
// 			1) When receive new opinion data from client, calc opinion score
// 			   [Score uses new opinion and weights of member opinion]
//				1.5) This then should call fn to update local meta  
// 			2) On startup, generate preferences (total 5) and store
// 				a) 2 like
// 				b) 2 don't like
// 				c) 1 randomly like or don't like
// 			3) API path to reset preferences
//        <----->
// 				x) Fn to calc group opinion score
// 				x) Fn to calc local opinion, using group opinion score
// 			6) Fn to update local meta 
// 			7) Fn to generate preferences 
// 			  [(for client prefs for parts and local group weight prefs)]
// 
// 

const localId = config.local.id
const weight1 = ((20 / (20 + 10 + 0)) / 2);
const weight2 = ((10 / (20 + 10 + 0)) / 2);
const weight3 = ((0 / (20 + 10 + 0)) / 2);
let selfWeight;
let groupWeight;

const segmentationParts = [
	"nose",
	"leftEye",
	"rightEye",
	"leftEar",
	"rightEar",
	"leftShoulder",
	"rightShoulder",
	"leftElbow",
	"rightElbow",
	"leftWrist",
	"rightWrist",
	"leftHip",
	"rightHip",
	"leftKnee",
	"rightKnee",
	"leftAnkle",
	"rightAnkle"
]

// exports.newOpinionFromClient = () => {
// 	calculateLocalOpinion(localOpinion, memberOpinions);
// }

exports.generate = () => {
	const choices = generateChoices();
	const opinionatedChoices = hateOrLove(choices);

	return opinionatedChoices;
}

function generateChoices() {
	const copySegmentationParts = [...segmentationParts]
	const choices = [];
	let choice;
	let rand;

	for (let i = 0; i < 5; i++) {
		rand = Math.floor(Math.random() * copySegmentationParts.length);
		choice = copySegmentationParts.splice(rand, 1);
		choices.push(choice[0]);
	}
	return choices;
}

function hateOrLove(choices) {
	const preferences = {
		hate: [choices[0], choices[2]],
		love: [choices[1], choices[3]]
	}

	const randomPreference = Math.random() > .5 ? "hate" : "love"
	preferences[randomPreference].push(choices[4])
	
	return preferences;
}


// NOTE: meta.opinion object:
// {
// 	id: config.local.name,
// 	memberNumber: 4, // 1 through 7
// 	score: 68.00
// }

// TODO: WARN: exports.calculateLocalOpinion is not named right. just generates opinion once new local opinion is created by client. need Fn that uses that new client to calculate local score!!!

function calculateLocalOpinion (localOpinion, memberOpinions) {
	const localScore = localOpinion * selfWeight;
	const groupScore = calculateGroupOpinion(memberOpinions) * groupWeight;
	const finalScore = ((localScore + groupScore) * 100)
	
	return finalScore;
}

function calculateGroupOpinion (memberOpinions) {
	let rawGroupScore;

	for (let i = 0; i < memberOpinions.length; i++) {
		rawGroupScore += applyGroupWeights(memberOpinions[i]);
	}

	return rawGroupScore;
}

function applyGroupWeights(memberOpinion) {
	const distance = Math.abs(memberOpinion.memberNumber - localId);
	const memberScore = memberOpinion.score / 100;
	let weightedScore;

	switch (distance) {
		case 1:
			weightedScore = memberScore * weight1;
			break;
		case 2:
			weightedScore = memberScore * weight2;
			break;
		case 3:
			weightedScore = memberScore * weight3;
			break;
	
		default:
			weight = 0;
			break;
	}

	return weightedScore;
}

// {
// 	score: 0.2701843608143356,
// 	keypoints: [{
// 			score: 0.9919676184654236,
// 			part: 'nose',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.9969831109046936,
// 			part: 'leftEye',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.9946723580360413,
// 			part: 'rightEye',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.32409271597862244,
// 			part: 'leftEar',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.9814074039459229,
// 			part: 'rightEar',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.06493322551250458,
// 			part: 'leftShoulder',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.07114896923303604,
// 			part: 'rightShoulder',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.018046526238322258,
// 			part: 'leftElbow',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.004184186924248934,
// 			part: 'rightElbow',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.01926998421549797,
// 			part: 'leftWrist',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.004699308890849352,
// 			part: 'rightWrist',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.05739530175924301,
// 			part: 'leftHip',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.010856086388230324,
// 			part: 'rightHip',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.007066067308187485,
// 			part: 'leftKnee',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.04118501767516136,
// 			part: 'rightKnee',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.0022347038611769676,
// 			part: 'leftAnkle',
// 			position: [Object]
// 		},
// 		{
// 			score: 0.0029915485065430403,
// 			part: 'rightAnkle',
// 			position: [Object]
// 		}
// 	]
// }