
const cutoffSlider = document.getElementById(
  "cutoffSlider"
) as HTMLInputElement;

const cutoffInput = document.getElementById(
  "cutoffInput"
) as HTMLInputElement;

const startButton = document.getElementById(
  "startButton"
) as HTMLButtonElement;

const resetButton = document.getElementById(
  "resetButton"
) as HTMLButtonElement;

const computerPlaysOptimal = document.getElementById(
	"computerPlaysOptimal"
) as HTMLInputElement;

const output = document.getElementById("output") as HTMLDivElement;


let gamesPlayed = 0;
let playerWins = 0;
let cpuWins = 0;

// clamp cutoffs between 0 and 1
function clamp(value: number) {
	return Math.min(Math.max(value, 0), 1);
}

function setCutoff(value: number): void {
	const clamped = clamp(value);
	const formatted = clamped.toFixed(3);

	cutoffSlider.value = formatted;
	cutoffInput.value = formatted;
}

function readCutoff(): number {
	const parsed = Number(cutoffInput.value);
	if (isNaN(parsed)) {
		return Number(cutoffSlider.value);
	}
	return clamp(parsed);
}



function rollWithCutoff(cutoff: number): number {
	let roll = Math.random();
	// console.log(`First roll: ${roll}. Cutoff is ${cutoff}.`);
	if (roll < cutoff) {
		roll = Math.random();
		// console.log(`Second roll: ${roll}`);
		return roll;
	}
	return roll;
}



function playGame(playerCutoff: number): void {
	// use the optimal value if the computer is set to play optimally
	// otherwise use the naive value of 1/2.
	const compCutoff = computerPlaysOptimal.checked ? 0.618034 : 0.5;

	const compRoll = rollWithCutoff(compCutoff);
	const playerRoll = rollWithCutoff(playerCutoff);

	const won = playerRoll >= compRoll;

	gamesPlayed ++;
	playerWins += won ? 1 : 0;
	cpuWins += won ? 0 : 1;
	
	// output.textContent = won ? `Win rate: ${playerWins / gamesPlayed}` : `You lose. Win rate: ${playerWins / gamesPlayed}`;
}

cutoffSlider.addEventListener("input", () => {
	console.log(cutoffSlider.value);
	console.log("test");
	setCutoff(Number(cutoffSlider.value));
});

cutoffInput.addEventListener("input", () => {
	const parsed = Number(cutoffInput.value);

	if (!isNaN(parsed)) {
		cutoffSlider.value = String(clamp(parsed));
	}
});

startButton.addEventListener("click", (event) => {
	console.log("Game start button clicked");
	for (let i = 0; i < 10000; i ++) {
		playGame(readCutoff());
	}
	output.textContent = `Win rate: ${playerWins / gamesPlayed}`;
});

resetButton.addEventListener("click", (event) => {
	console.log("Progress reset.");
	output.textContent = "Press the run sims button to test out your strategy."
	gamesPlayed = 0;
	playerWins = 0;
	cpuWins = 0;
});


document.addEventListener("DOMContentLoaded", () => {
	console.log("Starting random drawing game!");
	
});
