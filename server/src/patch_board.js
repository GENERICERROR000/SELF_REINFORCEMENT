const Gpio = require('pigpio').Gpio;

const startPatchBoard = (ws) => {
	console.log("")
	console.log("########################")
	console.log("# Starting Patch Board #")
	console.log("########################")
	console.log("")

	let startTickHead;
	let startTickTorso;
	let startTickArms;
	let startTickLegs;

	let noiseCheck1 = 0;
	let noiseCheck2 = 0;
	let noiseCheck3 = 0;
	let noiseCheck4 = 0;

	let prevSignal1 = 0;
	let prevSignal2 = 0;
	let prevSignal3 = 0;
	let prevSignal4 = 0;

	let stream1State = '';
	let stream2State = '';
	let stream3State = '';
	let stream4State = '';

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
		if ( 15 < x && x < 35 ) {
			if (prevSignal1 == x) {
				noiseCheck1++;

				if (stream1State != partName && noiseCheck1 == 4) {
					sendToClient("stream1", partName);

					console.log("");
					console.log("----------------------------------------");
					console.log("Stream 1 is now being sent to:", partName);
					console.log("----------------------------------------");
					console.log("");

					noiseCheck1 = 0;
					stream1State = partName;
				}
			} else {
				noiseCheck1 = 0;
			}

			prevSignal1 = x
			return;
		}

		if (40 < x && x < 60) {
			if (prevSignal2 == x) {
				noiseCheck2++;

				if (stream2State != partName && noiseCheck2 == 4) {
					sendToClient("stream2", partName);

					console.log("");
					console.log("----------------------------------------");
					console.log("Stream 2 is now being sent to:", partName);
					console.log("----------------------------------------");
					console.log("");

					noiseCheck2 = 0;
					stream2State = partName;
				}
			} else {
				noiseCheck2 = 0;
			}

			prevSignal2 = x
			return;
		}

		
		if (65 < x && x < 85) {
			if (prevSignal3 == x) {
				noiseCheck3++;

				if (stream3State != partName && noiseCheck3 == 4) {
					sendToClient("stream3", partName);

					console.log("");
					console.log("----------------------------------------");
					console.log("Stream 3 is now being sent to:", partName);
					console.log("----------------------------------------");
					console.log("");

					noiseCheck3 = 0;
					stream3State = partName;
				}
			} else {
				noiseCheck3 = 0;
			}

			prevSignal3 = x
			return;
		}

		if (90 < x && x < 110) {
			if (prevSignal4 == x) {
				noiseCheck4++;

				if (stream4State != partName && noiseCheck4 == 4) {
					sendToClient("stream4", partName);

					console.log("");
					console.log("----------------------------------------");
					console.log("Stream 4 is now being sent to:", partName);
					console.log("----------------------------------------");
					console.log("");

					noiseCheck4 = 0;
					stream4State = partName;
				}
			} else {
				noiseCheck4 = 0;
			}

			prevSignal4 = x
			return;
		}
	}

	const sendToClient = (streamName, partName) => {
		const data = {
			streamName,
			partName
		};

		ws.send(JSON.stringify(data));
	}

	const setAlert = (part, partTick, partName) => {
		part.on('alert', (level, tick) => {
			if (level == 1) {
				partTick = tick;
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