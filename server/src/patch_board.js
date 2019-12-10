const Gpio = require('pigpio').Gpio;

let startTickHead;
let startTickTorso;
let startTickArms;
let startTickLegs;

let displayStateHead;
let displayStateTorso;
let displayStateArms;
let displayStateLegs;

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

// NOTE: -----> Actions <-----

// TODO: Create WS sever
// TODO: Create function to track state change and send via WS 

setAlert(head, startTickHead)
setAlert(torso, startTickTorso)
setAlert(arms, startTickArms)
setAlert(legs, startTickLegs)

function setAlert(part, partTick) {
	part.on('alert', (level, tick) => {
		if (level == 1) {
			startTickHead = tick;
		} else {
			const endTick = tick;
			const diff = (endTick >> 0) - (partTick >> 0); // Unsigned 32 bit arithmetic

			if (diff < 150) {
				console.log("HEAD:", diff);
			}
		}
	});
}

// NOTE: -----> Startup <-----

setInterval(() => {
	console.log("");
	display1.trigger(25, 1);
	display2.trigger(50, 1);
	display3.trigger(75, 1);
	display4.trigger(100, 1);
}, 500);
