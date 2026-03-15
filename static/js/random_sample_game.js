var cutoffSlider = document.getElementById("cutoffSlider");
var cutoffInput = document.getElementById("cutoffInput");
var startButton = document.getElementById("startButton");
var resetButton = document.getElementById("resetButton");
var computerPlaysOptimal = document.getElementById("computerPlaysOptimal");
var output = document.getElementById("output");
var gamesPlayed = 0;
var playerWins = 0;
var cpuWins = 0;
// clamp cutoffs between 0 and 1
function clamp(value) {
    return Math.min(Math.max(value, 0), 1);
}
function setCutoff(value) {
    var clamped = clamp(value);
    var formatted = clamped.toFixed(3);
    cutoffSlider.value = formatted;
    cutoffInput.value = formatted;
}
function readCutoff() {
    var parsed = Number(cutoffInput.value);
    if (isNaN(parsed)) {
        return Number(cutoffSlider.value);
    }
    return clamp(parsed);
}
function rollWithCutoff(cutoff) {
    var roll = Math.random();
    // console.log(`First roll: ${roll}. Cutoff is ${cutoff}.`);
    if (roll < cutoff) {
        roll = Math.random();
        // console.log(`Second roll: ${roll}`);
        return roll;
    }
    return roll;
}
function playGame(playerCutoff) {
    // use the optimal value if the computer is set to play optimally
    // otherwise use the naive value of 1/2.
    var compCutoff = computerPlaysOptimal.checked ? 0.618034 : 0.5;
    var compRoll = rollWithCutoff(compCutoff);
    var playerRoll = rollWithCutoff(playerCutoff);
    var won = playerRoll >= compRoll;
    gamesPlayed++;
    playerWins += won ? 1 : 0;
    cpuWins += won ? 0 : 1;
    // output.textContent = won ? `Win rate: ${playerWins / gamesPlayed}` : `You lose. Win rate: ${playerWins / gamesPlayed}`;
}
cutoffSlider.addEventListener("input", function () {
    console.log(cutoffSlider.value);
    console.log("test");
    setCutoff(Number(cutoffSlider.value));
});
cutoffInput.addEventListener("input", function () {
    var parsed = Number(cutoffInput.value);
    if (!isNaN(parsed)) {
        cutoffSlider.value = String(clamp(parsed));
    }
});
startButton.addEventListener("click", function (event) {
    console.log("Game start button clicked");
    for (var i = 0; i < 10000; i++) {
        playGame(readCutoff());
    }
    output.textContent = "Win rate: ".concat(playerWins / gamesPlayed);
});
resetButton.addEventListener("click", function (event) {
    console.log("Progress reset.");
    output.textContent = "Press the run sims button to test out your strategy.";
    gamesPlayed = 0;
    playerWins = 0;
    cpuWins = 0;
});
document.addEventListener("DOMContentLoaded", function () {
    console.log("Starting random drawing game!");
});
