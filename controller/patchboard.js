const Gpio = require('pigpio').Gpio;

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

let startTickHead;
let startTickTorso;
let startTickArms;
let startTickLegs;

let displayStateHead;
let displayStateTorso;
let displayStateArms;
let displayStateLegs;

// TODO: create fn to encapsulate the alerts below (abstract it)
// TODO: Create WS sever
// TODO: Create function to track state change and send via WS 

head.on('alert', (level, tick) => {
	if (level == 1) {
		startTickHead = tick;
	} else {
		const endTick = tick;
		const diff = (endTick >> 0) - (startTickHead >> 0); // Unsigned 32 bit arithmetic
		
		if (diff < 150) {
			console.log("HEAD:", diff);
		}
	}
});

torso.on('alert', (level, tick) => {
	if (level == 1) {
		startTickTorso = tick;
	} else {
		const endTick = tick;
		const diff = (endTick >> 0) - (startTickTorso >> 0); // Unsigned 32 bit arithmetic
		
		if (diff < 150) {
			console.log("TORSO:", diff);
		}
	}
});

arms.on('alert', (level, tick) => {
	if (level == 1) {
		startTickArms = tick;
	} else {
		const endTick = tick;
		const diff = (endTick >> 0) - (startTickArms >> 0); // Unsigned 32 bit arithmetic
		
		if (diff < 150) {
			console.log("ARMS:", diff);
		}
	}
});

legs.on('alert', (level, tick) => {
	if (level == 1) {
		startTickLegs = tick;
	} else {
		const endTick = tick;
		const diff = (endTick >> 0) - (startTickLegs >> 0); // Unsigned 32 bit arithmetic
		
		if (diff < 150) {
			console.log("LEGS:", diff);
		}
	}
});

setInterval(() => {
	console.log("");
	display1.trigger(25, 1);
	display2.trigger(50, 1);
	display3.trigger(75, 1);
	display4.trigger(100, 1);
}, 500);