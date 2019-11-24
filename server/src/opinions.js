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

// exports.newOpinionFromClient = () => {
// 	calculateLocalOpinion(localOpinion, memberOpinions);
// }

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