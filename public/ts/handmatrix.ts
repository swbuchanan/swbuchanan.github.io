
class HandMatrix {
  private selectedHands: number[][] = [];
  private cardStrings: string[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  private handStringMatrix: string[][] = [];

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private cellSize = 40;


  constructor(canvasId: string) {
    for (let i = 0; i < this.cardStrings.length; i++) {
      const row: string[] = [];
      const otherrow: number[] = [];
      for (let j = 0; j < this.cardStrings.length; j++) {
        if (i === j) {
          // Pairs (e.g., AA, KK)
          row.push(`${this.cardStrings[i]}${this.cardStrings[j]}`);
        } else if (i < j) {
          // Suited hands (e.g., AKs, AQs)
          row.push(`${this.cardStrings[i]}${this.cardStrings[j]}s`);
        } else {
          // Offsuit hands (e.g., AKo, KQo)
          row.push(`${this.cardStrings[j]}${this.cardStrings[i]}o`);
        }
        otherrow.push(0);
      }
      this.handStringMatrix.push(row);
      this.selectedHands.push(otherrow);
    }
    console.log(this.handStringMatrix);
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;
    this.canvas.addEventListener("click", this.clickHand.bind(this));

    this.cellSize = this.canvas.width/13;
  }

  private clickHand(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const handIdxX = Math.floor(x/this.cellSize);
    const handIdxY = Math.floor(y/this.cellSize);
    console.log(this.handStringMatrix[handIdxY][handIdxX]);
    this.selectedHands[handIdxY][handIdxX] = (this.selectedHands[handIdxY][handIdxX] + 1) % 2;
    this.drawMatrix();
  }

  public drawMatrix() {
    const cellSize = this.cellSize; // Size of each cell in the matrix
    const padding = 0;  // Padding around text in each cell

    this.context.font = '16px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    this.handStringMatrix.forEach((row, rowIndex) => {
      row.forEach((hand, colIndex) => {
        const x = colIndex * cellSize + padding;
        const y = rowIndex * cellSize + padding;
        this.context.fillStyle = 'white';
        if (this.selectedHands[rowIndex][colIndex] === 1) {
          this.context.fillStyle = 'red';
        }
        this.context.fillRect(x, y, cellSize, cellSize); // Draw cell border
        this.context.fillStyle = 'black';
        this.context.fillText(hand, x + cellSize / 2, y + cellSize / 2); // Draw hand text
      });
    });
  }

}

document.addEventListener("DOMContentLoaded", () => {
  console.log("poker hand matrix v4 loaded");
  const handMatrix = new HandMatrix("myPokerHandMatrix"); // this name is determined by what??
  handMatrix.drawMatrix();
});
