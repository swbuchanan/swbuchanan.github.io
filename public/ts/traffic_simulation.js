// I am trying to design this in a compositional way
// for educational purposes
// idk if it's a good idea
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// compuse systems function for the design (we only have one system for now)
// TODO: understand this
function composeSystems() {
    var systems = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        systems[_i] = arguments[_i];
    }
    return function (state, input, ctx) {
        return systems.reduce(function (s, sys) { return sys(s, input, ctx); }, state);
    };
}
function distanceAhead(posBehind, posAhead, length) {
    if (posAhead > posBehind) {
        return posAhead - posBehind;
    }
    else if (posAhead < posBehind) {
        return length - (posBehind - posAhead);
    }
    else {
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
var trafficSystem = function (state, _input, _ctx) {
    var length = state.length, vMax = state.vMax, p = state.p;
    // sort cars by position to make gap calculation easier
    var driversSorted = __spreadArray([], state.drivers, true).sort(function (a, b) { return a.position - b.position; });
    var n = driversSorted.length;
    // compute new velocities for all cars
    var newDrivers = driversSorted.map(function (driver, index) {
        var nextDriver = driversSorted[(index + 1) % n];
        var gapDistance = distanceAhead(driver.position, nextDriver.position, length);
        // number of cells strictly between them
        var gap = gapDistance - 1;
        var v = driver.velocity;
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
        return __assign(__assign({}, driver), { velocity: Math.max(0, v) });
    });
    var movedDrivers = newDrivers.map(function (driver) { return (__assign(__assign({}, driver), { position: (driver.position + driver.velocity + length) % length })); });
    return __assign(__assign({}, state), { drivers: movedDrivers, stepCount: state.stepCount + 1 });
};
var SimulationEngine = /** @class */ (function () {
    function SimulationEngine(initialState, rootSystem) {
        this.time = 0;
        this.running = false;
        this.lastTimeStamp = null;
        this.animationFrameId = null;
        this.state = initialState;
        this.rootSystem = rootSystem;
    }
    SimulationEngine.prototype.getState = function () {
        return this.state;
    };
    SimulationEngine.prototype.reset = function (state) {
        this.state = state;
        this.time = 0;
        this.lastTimeStamp = null;
    };
    SimulationEngine.prototype.step = function (dt, input) {
        this.time += dt;
        var ctx = { dt: dt, time: this.time };
        this.state = this.rootSystem(this.state, input, ctx);
        return this.state;
    };
    SimulationEngine.prototype.start = function (inputProvider) {
        var _this = this;
        if (this.running)
            return;
        this.running = true;
        this.lastTimeStamp = performance.now();
        // how long one simulation step is in seconds
        // const fixedDt = 1/10;
        var accumulator = 0;
        var loop = function (timestamp) {
            var _a;
            if (!_this.running)
                return;
            var last = (_a = _this.lastTimeStamp) !== null && _a !== void 0 ? _a : timestamp;
            var dtMs = timestamp - last;
            _this.lastTimeStamp = timestamp;
            // treat each frame as dt = 1 simulation step
            // could also change this to dtMs / 1000 and accumulate steps
            // and only do an actual step when enough have accumulated
            var dt = 1;
            // const dtSeconds = dtMs / 1000;
            // accumulator += dtSeconds;
            var input = inputProvider();
            _this.step(dt, input);
            // while (accumulator >= fixedDt) {
            // this.step(fixedDt, input);
            // accumulator -= fixedDt;
            // }
            _this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    };
    SimulationEngine.prototype.stop = function () {
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    };
    return SimulationEngine;
}());
function createInitialTrafficState() {
    var length = 800;
    var numDrivers = 100;
    var vMax = 3.0;
    var p = 0.333;
    var spacing = Math.floor(length / numDrivers);
    var drivers = [];
    for (var i = 0; i < numDrivers; i++) {
        drivers.push({
            id: i,
            position: i * spacing,
            velocity: 0
        });
    }
    return {
        length: length,
        vMax: vMax,
        p: p,
        drivers: drivers,
        stepCount: 0
    };
}
function renderTrafficState(ctx, state) {
    var length = state.length, drivers = state.drivers;
    var width = ctx.canvas.width;
    var height = ctx.canvas.height * 0.1;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, height / 3, width, height / 3);
    var cellWidth = width / length;
    var driverHeight = height / 3;
    // draw cars
    ctx.fillStyle = "#000000";
    for (var _i = 0, drivers_1 = drivers; _i < drivers_1.length; _i++) {
        var driver = drivers_1[_i];
        var x = driver.position * cellWidth;
        var y = height / 3;
        ctx.fillRect(x, y, cellWidth, driverHeight);
    }
    // draw step counter
    // this doesn't work very will with the resized canvas
    //	ctx.fillStyle = "#000000";
    //	ctx.fillText(`Step: ${state.stepCount}`, 10, ctx.canvas.height - 20);
}
// initialize when the page loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("Starting traffic simulation");
    var canvas = document.getElementById("trafficCanvas");
    if (!canvas) {
        throw new Error("Canvas not found!");
    }
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Could not get 2d context!");
    }
    var initialState = createInitialTrafficState();
    var rootSystem = composeSystems(trafficSystem);
    var engine = new SimulationEngine(initialState, rootSystem);
    function inputProvider() {
        // later: UI toggles / sliders etc
        return {};
    }
    // TODO: understand binds
    var originalStep = engine.step.bind(engine);
    engine.step = function (dt, input) {
        var state = originalStep(dt, input);
        renderTrafficState(ctx, state);
        return state;
    };
    // initial render
    renderTrafficState(ctx, engine.getState());
    engine.start(inputProvider);
});
