'use strict'
const config = require('../config/config');
const gossip = require('./gossip');

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

// ----------> Generate Opinions <----------

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

exports.newFromClient = (member, newClientOpinions, localPreferences) => {
	const clientOpinion = calculateLocalOpinion(newClientOpinions, localPreferences);
	// TODO: gossip.GetmemOpins somehow
	const localOpinion = calculateLocalOpinion(clientOpinion, memberOpinions);
	// TODO: gossip. somehow
	gossip.updateScore(member, localOpinion)
}

// ----------> Calculate Opinion Sent From Client <----------

// TODO: NOTE: This should be async - use Promise...
function calculateClientOpinion(newClientOpinions, localPreferences) {
	let sumScores;
	let part;

	for (let i = 0; i < newClientOpinions.length; i++) {
		part = newClientOpinions[i].part;
		
		if (localPreferences.hate.includes(part)) {
			sumScores += (1 - newClientOpinions[i].score);
		}

		if (localPreferences.love.includes(part)) {
			sumScores += newClientOpinions[i].score;
		}
	}

	const finalScore = sumScores / localPreferences.length;

	return finalScore;
}

// ----------> Calculate Local Opinion <----------

// NOTE: meta.opinion object:
// {
// 	id: config.local.name,
// 	memberNumber: 4, // 1 through 7
// 	score: 68.00
// }

function calculateLocalOpinion (clientOpinion, memberOpinions) {
	const localScore = clientOpinion * selfWeight;
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