// Penney's Game — minimal canvas UI, TypeScript
var H = "H";
var T = "T";
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
// --- Layout constants (kept simple & readable)
var PADDING = 16;
var TILE_SIZE = 48;
var GAP = 10;
var topY = 24;
var myTilesX = PADDING;
var botTilesX = PADDING;
var tilesY = topY;
var infoY = tilesY + TILE_SIZE + 20;
var trackY = infoY + 36;
var trackHeight = 60;
var btnY = trackY + trackHeight + 24;
var btnW = 120;
var btnH = 40;
var playBtnRect = { x: PADDING, y: btnY, w: btnW, h: btnH };
var resetBtnRect = { x: PADDING + btnW + 10, y: btnY, w: btnW, h: btnH };
var timelineX = PADDING;
var timelineW = canvas.width - PADDING * 2;
// --- State
var mySeq = [H, H, T]; // default
var cpuSeq = counterSeq(mySeq); // auto-chosen
var running = false;
var winner = null;
var flips = [];
var lastTick = 0;
var msPerFlip = 200;
// --- Helpers
function counterSeq(user) {
    // Optimal response for length-3 Penney’s game:
    // for user ABC, computer picks ¬B, A, B
    var A = user[0], B = user[1];
    var not = function (x) { return (x === H ? T : H); };
    return [not(B), A, B];
}
function randFlip() {
    return Math.random() < 0.5 ? H : T;
}
function seqToString(s) {
    return s.join("");
}
function firstMatchIndex(haystack, needle) {
    if (haystack.length < needle.length)
        return null;
    for (var i = needle.length - 1; i < haystack.length; i++) {
        var ok = true;
        for (var k = 0; k < needle.length; k++) {
            if (haystack[i - needle.length + 1 + k] !== needle[k]) {
                ok = false;
                break;
            }
        }
        if (ok)
            return i; // index of last char in match
    }
    return null;
}
function checkWinner() {
    var you = firstMatchIndex(flips, mySeq);
    var cpu = firstMatchIndex(flips, cpuSeq);
    if (you === null && cpu === null)
        return null;
    if (you !== null && cpu === null)
        return "you";
    if (cpu !== null && you === null)
        return "cpu";
    // If both appear, the earlier finishing index wins
    return you <= cpu ? "you" : "cpu";
}
// --- Drawing
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawTile(x, y, v, opts) {
    var _a, _b, _c;
    var muted = (_a = opts === null || opts === void 0 ? void 0 : opts.muted) !== null && _a !== void 0 ? _a : false;
    var selected = (_b = opts === null || opts === void 0 ? void 0 : opts.selected) !== null && _b !== void 0 ? _b : false;
    ctx.fillStyle = selected ? "#1c2a1c" : "#151515";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = (_c = opts === null || opts === void 0 ? void 0 : opts.stroke) !== null && _c !== void 0 ? _c : "#333";
    ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    ctx.fillStyle = muted ? "#666" : "#ddd";
    ctx.font = "bold 22px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(v, x + TILE_SIZE / 2, y + TILE_SIZE / 2 + 1);
}
function drawLabel(text, x, y, muted) {
    if (muted === void 0) { muted = false; }
    ctx.fillStyle = muted ? "#7a7a7a" : "#cfcfcf";
    ctx.font = "13px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
}
function drawButton(rect, label, primary) {
    if (primary === void 0) { primary = false; }
    ctx.fillStyle = primary ? "#19331a" : "#1a1a1a";
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w - 1, rect.h - 1);
    ctx.fillStyle = "#eee";
    ctx.font = "bold 14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
}
function drawTrack() {
    // background
    ctx.fillStyle = "#121212";
    ctx.fillRect(timelineX, trackY, timelineW, trackHeight);
    ctx.strokeStyle = "#2a2a2a";
    ctx.strokeRect(timelineX + 0.5, trackY + 0.5, timelineW - 1, trackHeight - 1);
    // draw flips centered in tiles along the track
    var tileW = 32;
    var tileH = 38;
    var padding = 6;
    var slots = Math.floor((timelineW - padding * 2) / (tileW + 4));
    var startX = timelineX + padding;
    // figure out if/where a winning match ended, for highlighting
    var matchYou = firstMatchIndex(flips, mySeq);
    var matchCPU = firstMatchIndex(flips, cpuSeq);
    for (var i = 0; i < Math.min(flips.length, slots); i++) {
        var x = startX + i * (tileW + 4);
        var y = trackY + (trackHeight - tileH) / 2;
        // highlight if part of the winning match
        var highlight = null;
        if (winner === "you" && matchYou !== null && i > matchYou - 3 && i <= matchYou) {
            highlight = "rgba(40,120,40,0.25)";
        }
        if (winner === "cpu" && matchCPU !== null && i > matchCPU - 3 && i <= matchCPU) {
            highlight = "rgba(120,40,40,0.25)";
        }
        if (highlight) {
            ctx.fillStyle = highlight;
            ctx.fillRect(x - 2, y - 2, tileW + 4, tileH + 4);
        }
        // tile box
        ctx.fillStyle = "#161616";
        ctx.fillRect(x, y, tileW, tileH);
        ctx.strokeStyle = "#2f2f2f";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, tileW - 1, tileH - 1);
        // letter
        ctx.fillStyle = "#e6e6e6";
        ctx.font = "bold 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(flips[i], x + tileW / 2, y + tileH / 2 + 1);
    }
}
function draw() {
    clear();
    // Titles
    drawLabel("Your sequence", myTilesX, tilesY - 16);
    drawLabel("Computer (optimal reply)", botTilesX + 3 * (TILE_SIZE + GAP) + 30, tilesY - 16);
    // Your sequence tiles
    //   for (let i = 0; i < 3; i++) {
    //     const x = myTilesX + i * (TILE_SIZE + GAP);
    //     drawTile(x, tilesY, mySeq[i], { selected: true, stroke: "#3b463b" });
    //   }
    // CPU tiles (read-only)
    //   const cpuX = botTilesX + 3 * (TILE_SIZE + GAP) + 30;
    //   for (let i = 0; i < 3; i++) {
    //     const x = cpuX + i * (TILE_SIZE + GAP);
    //     drawTile(x, tilesY, cpuSeq[i], { muted: true });
    //   }
    // Info line
    //   const status = winner
    //     ? (winner === "you" ? "You win!" : "Computer wins.")
    //     : (running ? "Flipping…" : "Pick your sequence, then Play.");
    //   drawLabel(
    //     `Your: ${seqToString(mySeq)}    vs    CPU: ${seqToString(cpuSeq)}    —    ${status}`,
    //     PADDING, infoY
    //   );
    // Flip track
    drawTrack();
    // Buttons
    drawButton(playBtnRect, running ? "Flipping…" : "Play", !running);
    drawButton(resetBtnRect, "Reset");
    // Little legend for highlight colors
    ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(40,120,40,0.25)";
    ctx.fillRect(canvas.width - 240, btnY, 14, 14);
    ctx.fillStyle = "#9f9";
    ctx.fillText("your match", canvas.width - 240 + 20, btnY);
    ctx.fillStyle = "rgba(120,40,40,0.25)";
    ctx.fillRect(canvas.width - 240, btnY + 20, 14, 14);
    ctx.fillStyle = "#f99";
    ctx.fillText("computer match", canvas.width - 240 + 20, btnY + 20);
}
// --- Interaction
function pointInRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}
canvas.addEventListener("click", function (ev) {
    var rect = canvas.getBoundingClientRect();
    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top;
    // Toggle your tiles if clicked
    for (var i = 0; i < 3; i++) {
        var tileRect = {
            x: myTilesX + i * (TILE_SIZE + GAP),
            y: tilesY,
            w: TILE_SIZE, h: TILE_SIZE
        };
        if (!running && pointInRect(x, y, tileRect)) {
            mySeq[i] = mySeq[i] === H ? T : H;
            cpuSeq = counterSeq(mySeq);
            winner = null;
            draw();
            return;
        }
    }
    // Play
    if (!running && pointInRect(x, y, playBtnRect)) {
        // reset and start
        flips = [];
        winner = null;
        running = true;
        lastTick = performance.now();
        draw();
        return;
    }
    // Reset
    if (pointInRect(x, y, resetBtnRect)) {
        running = false;
        winner = null;
        flips = [];
        draw();
        return;
    }
});
// --- Loop
function tick(now) {
    if (running && !winner) {
        if (now - lastTick >= msPerFlip) {
            lastTick = now;
            flips.push(randFlip());
            winner = checkWinner();
            // stop after someone wins (keep the final board)
            if (winner)
                running = false;
            // prevent unbounded rendering width
            if (flips.length > 200)
                flips.shift();
            draw();
        }
    }
    requestAnimationFrame(tick);
}
draw();
requestAnimationFrame(tick);
