type HT = "H" | "T";
const H: HT = "H";
const T: HT = "T";

const canvas = document.getElementById("penneyGame") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let mySeq: HT[] = [H, H, T];
let cpuSeq: HT[] = counterSeq(mySeq); // there's just an algorithm to choose the best opposing sequence
let running = false;
let flips: HT[] = [];
let lastTick = 0;
let msPerFlip = 200;

function counterSeq(seq: HT[]): HT[] {
    // for the sequence A, B, C, the opponent should pick
    // (opposite of A), A, B
    const [A, B] = seq;
    const not = (x: HT): HT => (x === H ? T : H);
    return [not(B), A, B];
}

function randFlip(): HT {
    return Math.random() < 0.5 ? H : T;
}

function seqToString(s: HT[]) {
    return s.join("");
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

