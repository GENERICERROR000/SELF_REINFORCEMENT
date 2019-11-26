'use strict'
const config = require('../config/config');
const gossip = require('./gossip');

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
	const segmentationOpinions = hateOrLove(choices);
	const selfOrGroup = trustSelfOrGroup();

	return {
		segmentationOpinions,
		selfOrGroup
	};
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
	};

	const randomPreference = Math.random() > .5 ? "hate" : "love";
	preferences[randomPreference].push(choices[4]);
	
	return preferences;
}

function trustSelfOrGroup() {
	const rand = Math.floor(Math.random() * 5);

	switch (rand) {
		case 0:
			// Trust self more
			selfWeight = .75;
			groupWeight = .25;
			break;

		case 1:
			// Trust group and self the same
			selfWeight = .5;
			groupWeight = .5;
			break;

		case 2:
			// Trust group more
			selfWeight = .25;
			groupWeight = .75;
			break;

		case 3:
			// Trust self only
			selfWeight = 1;
			groupWeight = 0;
			break;

		case 4:
			// Trust group only
			selfWeight = 0;
			groupWeight = 1;
			break;

		default:
			// Trust group and self the same
			selfWeight = .5;
			groupWeight = .5;
			break;
	}
	
	const data = {
		selfWeight,
		groupWeight
	};

	return data;
}

exports.newFromClient = (member, newClientOpinions, localPreferences) => {
	const clientOpinion = calculateClientOpinion(newClientOpinions, localPreferences);
	const memberOpinions = getGroupOpinions(member);
	const localOpinion = calculateLocalOpinion(clientOpinion, memberOpinions);

	gossip.updateScore(member, localOpinion)
}

function getGroupOpinions(member) {
	const members = gossip.getMembers(member);
	const keys = Object.keys(members);
	let opinions = [];

	for (let i = 0; i < keys.length; i++) {
		opinions.push(members[keys[i]].meta.opinions);
	}

	return opinions;
}

// ----------> Calculate Opinion Sent From Client <----------

// TODO: NOTE: This should be async - use Promise...
function calculateClientOpinion(newClientOpinions, localPreferences) {
	let sumScores = 0;
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

	const finalScore = sumScores / 5;

	return finalScore;
}

// ----------> Calculate Local Opinion <----------

function calculateLocalOpinion (clientOpinion, memberOpinions) {
	const localScore = clientOpinion * selfWeight;
	const groupScore = calculateGroupOpinion(memberOpinions) * groupWeight;
	const finalScore = ((localScore + groupScore) * 100)

	return finalScore;
}

function calculateGroupOpinion (memberOpinions) {
	const length = memberOpinions.length;
	let rawGroupScore = 0;

	for (let i = 0; i < length; i++) {
		if (memberOpinions[i].mode == 'member') {
			rawGroupScore += applyGroupWeights(memberOpinions[i], length);
		}
	}

	return rawGroupScore;
}

function applyGroupWeights(memberOpinion, length) {
	let weightedScore;

	if (memberOpinion.score) {
		const distance = calcDistance(memberOpinion.id, localId, length);
		const memberScore = memberOpinion.score / 100;

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
				weightedScore = 0;
				break;
		}
	} else {
		weightedScore = 0;
	}

	return weightedScore;
}

function calcDistance(a, b, l) {
	let x = mod((a - b), l);
	let y = mod((b - a), l);

	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	return Math.min(x, y);
}