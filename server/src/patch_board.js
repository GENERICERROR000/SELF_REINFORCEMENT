const Gpio = require('pigpio').Gpio;

const startPatchBoard = (wss) => {
	console.log("Srtating Patch Board...")
	console.log("")

	let startTickHead;
	let startTickTorso;
	let startTickArms;
	let startTickLegs;

	let noiseCheck1 = 0;
	let noiseCheck2 = 0;
	let noiseCheck3 = 0;
	let noiseCheck4 = 0;

	let stream1State = "head";
	let stream2State = "torso";
	let stream3State = "arms";
	let stream4State = "legs";

	// NOTE: -----> Set GPIO Pins <-----

	const display1 = new Gpio(2, {
		mode: Gpio.OUTPUT,
	});

	const display2 = new Gpio(4, {
		mode: Gpio.OUTPUT,
	});

	const display3 = new Gpio(17, {
		mode: Gpio.OUTPUT,
	});

	const display4 = new Gpio(22, {
		mode: Gpio.OUTPUT,
	});

	const head = new Gpio(1, {
		mode: Gpio.INPUT,
		alert: true
	});

	const torso = new Gpio(12, {
		mode: Gpio.INPUT,
		alert: true
	});

	const arms = new Gpio(16, {
		mode: Gpio.INPUT,
		alert: true
	});

	const legs = new Gpio(21, {
		mode: Gpio.INPUT,
		alert: true
	});

	// NOTE: -----> Alert Actions <-----

	const determineStream = (x, partName) => {
		if ( 15 < x < 35 ) {
			noiseCheck1++
			noiseCheck1++
			if (stream1State != partName && noiseCheck1 == 3) {
				sendToClient("stream1", partName);
				console.log("Stream 1 is now being sent to:", partName)

				noiseCheck1 = 0
				stream1State = partName;
			}
			return;
		}

		if ( 40 < x < 60 ) {
			noiseCheck2++
			if (stream2State != partName && noiseCheck2 == 3) {
				sendToClient("stream2", partName);
				console.log("Stream 2 is now being sent to:", partName)

				noiseCheck2 = 0
				stream2State = partName;
			}
			return;
		}

		if ( 65 < x < 85 ) {
			noiseCheck3++
			if (stream3State != partName && noiseCheck3 == 3) {
				sendToClient("stream3", partName);
				console.log("Stream 3 is now being sent to:", partName)

				noiseCheck3 = 0
				stream3State = partName;
			}
			return;
		}

		if ( 90 < x < 110) {
			noiseCheck4++
			if (stream4State != partName && noiseCheck4 == 3) {
				sendToClient("stream4", partName);
				console.log("Stream 4 is now being sent to:", partName)

				noiseCheck4 = 0
				stream4State = partName;
			}
			return;
		}
	}

	const sendToClient = (streamName, partName) => {
		const data = {
			streamName,
			partName
		}

		wss.send(data);
	}

	const setAlert = (part, partTick) => {
		part.on('alert', (level, tick) => {
			if (level == 1) {
				startTickHead = tick;
			} else {
				const endTick = tick;
				const diff = (endTick >> 0) - (partTick >> 0); // Unsigned 32 bit arithmetic

				if (diff <= 110) determineStream(diff, partName);
			}
		});
	}

	setAlert(head, startTickHead, "head");
	setAlert(torso, startTickTorso, "torso");
	setAlert(arms, startTickArms, "arms");
	setAlert(legs, startTickLegs, "legs");

	// NOTE: -----> Start Writing Writing To GPIO <-----

	setInterval(() => {
		display1.trigger(25, 1);
		display2.trigger(50, 1);
		display3.trigger(75, 1);
		display4.trigger(100, 1);
	}, 250);

}

module.exports = startPatchBoard;