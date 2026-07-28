type PuzzlePosition = {
  row: number;
  column: number;
};

class FifteenGame {
  private readonly root: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private restartButton: HTMLButtonElement | null;
  private reverseCheckbox: HTMLInputElement | null;
  private status: HTMLElement | null;
  private reverseControls = false;
  private boardSize: number;
  private defaultSetup: boolean;
  private initialBoard: number[][];
  private board!: number[][];
  private emptyTile!: PuzzlePosition;

  constructor(root: HTMLElement) {
    this.root = root;
    const canvas = root.querySelector<HTMLCanvasElement>(".fifteen-game__canvas");
    const context = canvas?.getContext("2d");
    this.restartButton = root.querySelector<HTMLButtonElement>(".fifteen-game__restart");
    this.reverseCheckbox = root.querySelector<HTMLInputElement>(".fifteen-game__reverse");
    this.status = root.querySelector<HTMLElement>(".fifteen-game__status");

    const configuredSize = Number.parseInt(root.dataset.size ?? "", 10);
    this.boardSize = Number.isInteger(configuredSize)
      ? Math.min(8, Math.max(2, configuredSize))
      : 4;
    this.defaultSetup = root.dataset.defaultSetup === "true";
    this.initialBoard = this.createInitialBoard();

    if (!canvas || !context) {
      return;
    }
    this.canvas = canvas;
    this.context = context;
    this.reset();

    this.canvas.addEventListener("keydown", (event) => this.handleKeyDown(event));
    this.canvas.addEventListener("click", (event) => this.handleCanvasClick(event));
    this.restartButton?.addEventListener("click", () => {
      this.reset();
      this.canvas.focus();
    });
    this.reverseCheckbox?.addEventListener("change", () => {
      this.reverseControls = this.reverseCheckbox?.checked ?? false;
    });
  }

  private createSolvedBoard(): number[][] {
    return Array.from({ length: this.boardSize }, (_, row) =>
      Array.from({ length: this.boardSize }, (_, column) => {
        const value = row * this.boardSize + column + 1;
        return value === this.boardSize * this.boardSize ? 0 : value;
      })
    );
  }

  private createInitialBoard(): number[][] {
    if (this.boardSize === 4 && !this.defaultSetup) {
      return [
        [15, 14, 13, 12],
        [8, 9, 10, 11],
        [5, 7, 6, 0],
        [1, 2, 4, 3]
      ];
    }

    return this.createSolvedBoard();
  }

  private reset(): void {
    this.board = this.initialBoard.map((row) => row.slice());
    this.findEmptyTile();
    this.draw();
    this.updateStatus();
  }

  private findEmptyTile(): void {
    for (let row = 0; row < this.boardSize; row += 1) {
      const column = this.board[row].indexOf(0);
      if (column !== -1) {
        this.emptyTile = { row, column };
        return;
      }
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const normalMoves: Record<string, [number, number]> = {
      ArrowUp: [1, 0],
      ArrowDown: [-1, 0],
      ArrowLeft: [0, 1],
      ArrowRight: [0, -1]
    };
    const reverseMoves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1]
    };
    const move = (this.reverseControls ? reverseMoves : normalMoves)[event.key];

    if (!move) {
      return;
    }

    event.preventDefault();
    this.tryMove(
      this.emptyTile.row + move[0],
      this.emptyTile.column + move[1]
    );
  }

  private handleCanvasClick(event: MouseEvent): void {
    const bounds = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / bounds.width;
    const scaleY = this.canvas.height / bounds.height;
    const column = Math.floor(
      ((event.clientX - bounds.left) * scaleX) /
      (this.canvas.width / this.boardSize)
    );
    const row = Math.floor(
      ((event.clientY - bounds.top) * scaleY) /
      (this.canvas.height / this.boardSize)
    );

    this.canvas.focus();
    if (
      Math.abs(row - this.emptyTile.row) +
      Math.abs(column - this.emptyTile.column) === 1
    ) {
      this.tryMove(row, column);
    }
  }

  private tryMove(row: number, column: number): void {
    if (
      row < 0 ||
      row >= this.boardSize ||
      column < 0 ||
      column >= this.boardSize
    ) {
      return;
    }

    this.board[this.emptyTile.row][this.emptyTile.column] = this.board[row][column];
    this.board[row][column] = 0;
    this.emptyTile = { row, column };
    this.draw();
    this.updateStatus();
  }

  private isSolved(): boolean {
    const values = this.board.reduce<number[]>((all, row) => all.concat(row), []);
    return values.every((value, index) => {
      const expected = index === values.length - 1 ? 0 : index + 1;
      return value === expected;
    });
  }

  private updateStatus(): void {
    if (!this.status) {
      return;
    }

    this.status.textContent = this.isSolved()
      ? "Puzzle solved."
      : "Focus the board and use the arrow keys, or select a tile next to the empty space.";
  }

  private draw(): void {
    const tileWidth = this.canvas.width / this.boardSize;
    const tileHeight = this.canvas.height / this.boardSize;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let row = 0; row < this.boardSize; row += 1) {
      for (let column = 0; column < this.boardSize; column += 1) {
        const tile = this.board[row][column];
        if (tile === 0) {
          continue;
        }

        this.context.fillStyle = `hsl(${tile * 10}, 50%, 55%)`;
        this.context.fillRect(
          column * tileWidth,
          row * tileHeight,
          tileWidth,
          tileHeight
        );
        this.context.strokeStyle = "rgba(0, 0, 0, 0.45)";
        this.context.strokeRect(
          column * tileWidth,
          row * tileHeight,
          tileWidth,
          tileHeight
        );
        this.context.fillStyle = "#111";
        this.context.font = `600 ${Math.max(18, tileWidth * 0.32)}px system-ui, sans-serif`;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(
          String(tile),
          column * tileWidth + tileWidth / 2,
          row * tileHeight + tileHeight / 2
        );
      }
    }
  }
}

function initializeFifteenGames(): void {
  document.querySelectorAll<HTMLElement>("[data-fifteen-game]").forEach((root) => {
    if (root.dataset.fifteenInitialized === "true") {
      return;
    }

    root.dataset.fifteenInitialized = "true";
    new FifteenGame(root);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeFifteenGames, { once: true });
} else {
  initializeFifteenGames();
}
