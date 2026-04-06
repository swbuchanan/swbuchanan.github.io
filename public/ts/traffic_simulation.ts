
// I am trying to design this in a compositional way
// for educational purposes
// idk if it's a good idea

// this declares a function type
type System<S, I> = (
	state: S,
	input: I,
	ctx: TickContext
) => S;

// a single driver
interface Driver {
	id: number;
	position: number;
	velocity: number;
}

// a generic state for the simulation
interface TrafficState {
	length: number;		// number of cells on the ring
	vMax: number;		// max velocity cars can drive
	p: number;			// random slowdown probability (0..1)
	drivers: Driver[];	// cars on the ring
	stepCount: number;	// for debugging
}

// I may make it so the user can add cars or something
interface TrafficInput {
	// add later maybe
}

// context for a simulation tick (I don't really understand this)
interface TickContext {
	dt: number;		// time since last step in seconds
	time: number;	// accumulated time
}


// compuse systems function for the design (we only have one system for now)
// TODO: understand this
function composeSystems<S, I>(...systems: System<S,I>[]): System<S, I> {
	return (state: S, input: I, ctx: TickContext): S =>
		systems.reduce((s, sys) => sys(s, input, ctx), state);
}

function distanceAhead(posBehind: number, posAhead: number, length: number): number {
	if (posAhead > posBehind) {
		return posAhead - posBehind;
	} else if (posAhead < posBehind) {
		return length - (posBehind - posAhead);
	} else {
		return length;
	}
}

// this defines a traffic system that follows the rules of Nagel-Schreckenberg
// at each stage of the simulation, all cars go through the following steps in parallel
// 1) if the velocity is below vMax, our velocity is increased by 1
// 2) if the distance to the car in front is d units and we have velocity v >= d, 
// 		our velocity is reduced to d-1
// 3) if the velocity is positive then with probability p we reduce the velocity by 1
// 4) the position is updated
const trafficSystem: System<TrafficState, TrafficInput> = (state, _input, _ctx) => {

	const { length, vMax, p } = state;

	// sort cars by position to make gap calculation easier
	const driversSorted = [...state.drivers].sort((a,b) => a.position - b.position);
	const n = driversSorted.length;

	// compute new velocities for all cars
	const newDrivers: Driver[] = driversSorted.map((driver, index) => {
		const nextDriver = driversSorted[(index + 1) % n];
		const gapDistance = distanceAhead(driver.position, nextDriver.position, length);

		// number of cells strictly between them
		const gap = gapDistance - 1;

		let v = driver.velocity;

		if (v < vMax) {
			v = v + 1;
		}
		if (v > gap) {
			v = gap;
		}
		if (v > 0 && Math.random() < p) {
			v = v - 1;
		}

		// Movement will be done in a second pass (remember all steps happen in parallel)
		return {
			...driver,
			velocity: Math.max(0, v),
		};
	});

	const movedDrivers: Driver[] = newDrivers.map((driver) => ({
		...driver,
		position: (driver.position + driver.velocity + length) % length,
	}));

	return {
		...state,
		drivers: movedDrivers,
		stepCount: state.stepCount + 1,
	};
};


class SimulationEngine<S, I> {
	private state: S;
	private readonly rootSystem: System<S, I>;
	private time = 0;
	private running = false;
	private lastTimeStamp: number | null = null;
	private animationFrameId: number | null = null;

	constructor(initialState: S, rootSystem: System<S, I>) {
		this.state = initialState;
		this.rootSystem = rootSystem;
	}

	getState(): S {
		return this.state;
	}

	reset(state: S): void {
		this.state = state;
		this.time = 0;
		this.lastTimeStamp = null;
	}

	step(dt: number, input: I): S {
		this.time += dt;
		const ctx: TickContext = { dt, time: this.time };
		this.state = this.rootSystem(this.state, input, ctx);
		return this.state;
	}

	start(inputProvider: () => I): void {
		if (this.running) return;
		this.running = true;
		this.lastTimeStamp = performance.now();

		// how long one simulation step is in seconds
		// const fixedDt = 1/10;

		let accumulator = 0;

		const loop = (timestamp: number) => {
			if (!this.running) return;

			const last = this.lastTimeStamp ?? timestamp;
			const dtMs = timestamp - last;
			this.lastTimeStamp = timestamp;

			// treat each frame as dt = 1 simulation step
			// could also change this to dtMs / 1000 and accumulate steps
			// and only do an actual step when enough have accumulated
			const dt = 1;

			// const dtSeconds = dtMs / 1000;
			// accumulator += dtSeconds;

			const input = inputProvider();

			this.step(dt, input);

			// while (accumulator >= fixedDt) {

				// this.step(fixedDt, input);
				// accumulator -= fixedDt;
			// }


			this.animationFrameId = requestAnimationFrame(loop);
		};

		this.animationFrameId = requestAnimationFrame(loop);
	}

	stop(): void {
		this.running = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}
}

function createInitialTrafficState(): TrafficState {
	const length = 700;
	const numDrivers = 100;
	const vMax = 3;
	const p = 0.333;

	const spacing = Math.floor(length / numDrivers);

	const drivers: Driver[] = [];
	for (let i = 0; i < numDrivers; i++) {
		drivers.push({
			id: i,
			position: i * spacing,
			velocity: 0,
		});
	}

	return {
		length,
		vMax,
		p,
		drivers,
		stepCount: 0,
	};
}

function renderTrafficState(ctx: CanvasRenderingContext2D, state: TrafficState) {
	const { length, drivers } = state;
	const width = ctx.canvas.width;
	const height = ctx.canvas.height * 0.2;

	ctx.clearRect(0, 0, width, height);

	ctx.fillStyle = "#f0f0f0";
	ctx.fillRect(0, height / 3, width, height / 3);

	const cellWidth = width / length;
	const driverHeight = height / 3;

	// draw cars
	ctx.fillStyle = "#000000";
	for (const driver of drivers) {
		const x = driver.position * cellWidth;
		const y = height / 3;
		ctx.fillRect(x, y, cellWidth, driverHeight);
	}

	// draw step counter
	// this doesn't work very will with the resized canvas
//	ctx.fillStyle = "#000000";
//	ctx.fillText(`Step: ${state.stepCount}`, 10, ctx.canvas.height - 20);
}

// initialize when the page loads

document.addEventListener("DOMContentLoaded", () => {
	console.log("Starting traffic simulation");
	const canvas = document.getElementById("trafficCanvas") as HTMLCanvasElement | null;
	if (!canvas) {
		throw new Error("Canvas not found!");
	}

	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Could not get 2d context!");
	}

	const initialState = createInitialTrafficState();

	const rootSystem = composeSystems<TrafficState, TrafficInput>(
		trafficSystem,
	);

	const engine = new SimulationEngine<TrafficState, TrafficInput>(
		initialState,
		rootSystem
	);

	function inputProvider(): TrafficInput {
		// later: UI toggles / sliders etc
		return {};
	}
	
	// TODO: understand binds
	const originalStep = engine.step.bind(engine);
	engine.step = (dt: number, input: TrafficInput) => {
		const state = originalStep(dt, input);
		renderTrafficState(ctx, state);
		return state;
	}

	// initial render
	renderTrafficState(ctx, engine.getState());

	engine.start(inputProvider);
});
