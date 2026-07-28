type CoinFlip = "H" | "T";
type PenneyWinner = "player" | "computer" | null;

type CanvasRectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

(() => {
  const HEADS: CoinFlip = "H";
  const TAILS: CoinFlip = "T";

  class PenneyGame {
    private readonly root: HTMLElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private readonly padding = 16;
    private readonly tileSize = 48;
    private readonly gap = 10;
    private readonly tilesY = 24;
    private readonly infoY = this.tilesY + this.tileSize + 20;
    private readonly trackY = this.infoY + 36;
    private readonly trackHeight = 60;
    private readonly buttonY = this.trackY + this.trackHeight + 24;
    private readonly buttonWidth = 120;
    private readonly buttonHeight = 40;
    private readonly playButton: CanvasRectangle;
    private readonly resetButton: CanvasRectangle;
    private readonly timelineWidth: number;
    private readonly millisecondsPerFlip = 200;
    private playerSequence: CoinFlip[] = [];
    private computerSequence: CoinFlip[] = [];
    private running = false;
    private winner: PenneyWinner = null;
    private flips: CoinFlip[] = [];
    private lastTick = 0;
    private animationFrame: number | null = null;

    constructor(root: HTMLElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
      this.root = root;
      this.canvas = canvas;
      this.context = context;
      this.playButton = {
        x: this.padding,
        y: this.buttonY,
        width: this.buttonWidth,
        height: this.buttonHeight
      };
      this.resetButton = {
        x: this.padding + this.buttonWidth + 10,
        y: this.buttonY,
        width: this.buttonWidth,
        height: this.buttonHeight
      };
      this.timelineWidth = this.canvas.width - this.padding * 2;

      this.canvas.addEventListener("click", (event) => this.handleClick(event));
      this.canvas.addEventListener("keydown", (event) => this.handleKeyDown(event));
      this.reset();
    }

    private counterSequence(sequence: CoinFlip[]): CoinFlip[] {
      const [first, second] = sequence;
      return [second === HEADS ? TAILS : HEADS, first, second];
    }

    private reset(): void {
      if (this.animationFrame !== null) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      this.playerSequence = [HEADS, HEADS, TAILS];
      this.computerSequence = this.counterSequence(this.playerSequence);
      this.running = false;
      this.winner = null;
      this.flips = [];
      this.lastTick = 0;
      this.draw();
    }

    private start(): void {
      if (this.running) {
        return;
      }
      this.flips = [];
      this.winner = null;
      this.running = true;
      this.lastTick = performance.now();
      this.draw();
      this.animationFrame = requestAnimationFrame((now) => this.tick(now));
    }

    private randomFlip(): CoinFlip {
      return Math.random() < 0.5 ? HEADS : TAILS;
    }

    private firstMatchIndex(haystack: CoinFlip[], needle: CoinFlip[]): number | null {
      if (haystack.length < needle.length) {
        return null;
      }

      for (let index = needle.length - 1; index < haystack.length; index += 1) {
        let matches = true;
        for (let offset = 0; offset < needle.length; offset += 1) {
          if (haystack[index - needle.length + 1 + offset] !== needle[offset]) {
            matches = false;
            break;
          }
        }
        if (matches) {
          return index;
        }
      }

      return null;
    }

    private checkWinner(): PenneyWinner {
      const playerMatch = this.firstMatchIndex(this.flips, this.playerSequence);
      const computerMatch = this.firstMatchIndex(this.flips, this.computerSequence);

      if (playerMatch === null && computerMatch === null) {
        return null;
      }
      if (computerMatch === null) {
        return "player";
      }
      if (playerMatch === null) {
        return "computer";
      }
      return playerMatch <= computerMatch ? "player" : "computer";
    }

    private tick(now: number): void {
      if (!this.running) {
        this.animationFrame = null;
        return;
      }

      if (now - this.lastTick >= this.millisecondsPerFlip) {
        this.lastTick = now;
        this.flips.push(this.randomFlip());
        this.winner = this.checkWinner();
        if (this.flips.length > 200) {
          this.flips.shift();
        }
        if (this.winner) {
          this.running = false;
        }
        this.draw();
      }

      if (this.running) {
        this.animationFrame = requestAnimationFrame((time) => this.tick(time));
      } else {
        this.animationFrame = null;
      }
    }

    private toggleTile(index: number): void {
      if (this.running) {
        return;
      }
      this.playerSequence[index] =
        this.playerSequence[index] === HEADS ? TAILS : HEADS;
      this.computerSequence = this.counterSequence(this.playerSequence);
      this.winner = null;
      this.draw();
    }

    private canvasPosition(event: MouseEvent): { x: number; y: number } {
      const bounds = this.canvas.getBoundingClientRect();
      return {
        x: (event.clientX - bounds.left) * (this.canvas.width / bounds.width),
        y: (event.clientY - bounds.top) * (this.canvas.height / bounds.height)
      };
    }

    private pointInRectangle(
      point: { x: number; y: number },
      rectangle: CanvasRectangle
    ): boolean {
      return (
        point.x >= rectangle.x &&
        point.x <= rectangle.x + rectangle.width &&
        point.y >= rectangle.y &&
        point.y <= rectangle.y + rectangle.height
      );
    }

    private handleClick(event: MouseEvent): void {
      const point = this.canvasPosition(event);
      this.canvas.focus();

      for (let index = 0; index < 3; index += 1) {
        const tile: CanvasRectangle = {
          x: this.padding + index * (this.tileSize + this.gap),
          y: this.tilesY,
          width: this.tileSize,
          height: this.tileSize
        };
        if (this.pointInRectangle(point, tile)) {
          this.toggleTile(index);
          return;
        }
      }

      if (this.pointInRectangle(point, this.playButton)) {
        this.start();
      } else if (this.pointInRectangle(point, this.resetButton)) {
        this.reset();
      }
    }

    private handleKeyDown(event: KeyboardEvent): void {
      if (["1", "2", "3"].includes(event.key)) {
        event.preventDefault();
        this.toggleTile(Number(event.key) - 1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.start();
      } else if (event.key === "Escape") {
        event.preventDefault();
        this.reset();
      }
    }

    private clear(): void {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawLabel(text: string, x: number, y: number, muted = false): void {
      this.context.fillStyle = muted ? "#888" : "#ddd";
      this.context.font = "13px system-ui, -apple-system, Segoe UI, sans-serif";
      this.context.textBaseline = "top";
      this.context.textAlign = "left";
      this.context.fillText(text, x, y);
    }

    private drawTile(x: number, y: number, value: CoinFlip, muted = false): void {
      this.context.fillStyle = muted ? "#171717" : "#1c2a1c";
      this.context.fillRect(x, y, this.tileSize, this.tileSize);
      this.context.lineWidth = 1.5;
      this.context.strokeStyle = muted ? "#333" : "#536653";
      this.context.strokeRect(x + 0.5, y + 0.5, this.tileSize - 1, this.tileSize - 1);
      this.context.fillStyle = muted ? "#888" : "#eee";
      this.context.font = "700 22px system-ui, -apple-system, Segoe UI, sans-serif";
      this.context.textBaseline = "middle";
      this.context.textAlign = "center";
      this.context.fillText(
        value,
        x + this.tileSize / 2,
        y + this.tileSize / 2 + 1
      );
    }

    private drawButton(button: CanvasRectangle, label: string, primary = false): void {
      this.context.fillStyle = primary ? "#244526" : "#1a1a1a";
      this.context.fillRect(button.x, button.y, button.width, button.height);
      this.context.strokeStyle = "#555";
      this.context.lineWidth = 1.5;
      this.context.strokeRect(
        button.x + 0.5,
        button.y + 0.5,
        button.width - 1,
        button.height - 1
      );
      this.context.fillStyle = "#eee";
      this.context.font = "700 14px system-ui, -apple-system, Segoe UI, sans-serif";
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.fillText(
        label,
        button.x + button.width / 2,
        button.y + button.height / 2
      );
    }

    private drawTrack(): void {
      const tileWidth = 32;
      const tileHeight = 38;
      const padding = 6;
      const slots = Math.floor((this.timelineWidth - padding * 2) / (tileWidth + 4));
      const visibleFlips = this.flips.slice(-slots);
      const playerMatch = this.firstMatchIndex(visibleFlips, this.playerSequence);
      const computerMatch = this.firstMatchIndex(visibleFlips, this.computerSequence);

      this.context.fillStyle = "#121212";
      this.context.fillRect(
        this.padding,
        this.trackY,
        this.timelineWidth,
        this.trackHeight
      );
      this.context.strokeStyle = "#333";
      this.context.strokeRect(
        this.padding + 0.5,
        this.trackY + 0.5,
        this.timelineWidth - 1,
        this.trackHeight - 1
      );

      visibleFlips.forEach((flip, index) => {
        const x = this.padding + padding + index * (tileWidth + 4);
        const y = this.trackY + (this.trackHeight - tileHeight) / 2;
        let highlight: string | null = null;
        if (
          this.winner === "player" &&
          playerMatch !== null &&
          index > playerMatch - 3 &&
          index <= playerMatch
        ) {
          highlight = "rgba(40, 120, 40, 0.35)";
        }
        if (
          this.winner === "computer" &&
          computerMatch !== null &&
          index > computerMatch - 3 &&
          index <= computerMatch
        ) {
          highlight = "rgba(120, 40, 40, 0.35)";
        }
        if (highlight) {
          this.context.fillStyle = highlight;
          this.context.fillRect(x - 2, y - 2, tileWidth + 4, tileHeight + 4);
        }

        this.context.fillStyle = "#191919";
        this.context.fillRect(x, y, tileWidth, tileHeight);
        this.context.strokeStyle = "#3a3a3a";
        this.context.strokeRect(x + 0.5, y + 0.5, tileWidth - 1, tileHeight - 1);
        this.context.fillStyle = "#eee";
        this.context.font = "700 18px system-ui, -apple-system, Segoe UI, sans-serif";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillText(flip, x + tileWidth / 2, y + tileHeight / 2 + 1);
      });
    }

    private draw(): void {
      this.clear();
      const computerX = this.padding + 3 * (this.tileSize + this.gap) + 30;

      this.drawLabel("Your sequence", this.padding, this.tilesY - 17);
      this.drawLabel("Computer reply", computerX, this.tilesY - 17, true);
      this.playerSequence.forEach((value, index) => {
        this.drawTile(
          this.padding + index * (this.tileSize + this.gap),
          this.tilesY,
          value
        );
      });
      this.computerSequence.forEach((value, index) => {
        this.drawTile(
          computerX + index * (this.tileSize + this.gap),
          this.tilesY,
          value,
          true
        );
      });

      const status = this.winner
        ? this.winner === "player" ? "You win!" : "Computer wins."
        : this.running ? "Flipping…" : "Choose your sequence, then play.";
      this.drawLabel(
        `Your ${this.playerSequence.join("")} vs computer ${this.computerSequence.join("")} — ${status}`,
        this.padding,
        this.infoY
      );
      this.drawTrack();
      this.drawButton(this.playButton, this.running ? "Flipping…" : "Play", !this.running);
      this.drawButton(this.resetButton, "Reset");

      this.context.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
      this.context.textAlign = "left";
      this.context.textBaseline = "top";
      this.context.fillStyle = "#b7e5b7";
      this.context.fillText("Green: your match", this.canvas.width - 180, this.buttonY);
      this.context.fillStyle = "#efb4b4";
      this.context.fillText("Red: computer match", this.canvas.width - 180, this.buttonY + 20);

      this.canvas.setAttribute(
        "aria-label",
        `Penney's game. Your sequence is ${this.playerSequence.join(" ")}. ` +
        `The computer sequence is ${this.computerSequence.join(" ")}. ${status} ` +
        "Use number keys 1 to 3 to change your sequence, Enter to play, and Escape to reset."
      );
    }
  }

  function initializePenneyGames(): void {
    document.querySelectorAll<HTMLElement>(".penney-game").forEach((root) => {
      if (root.dataset.penneyInitialized === "true") {
        return;
      }
      const canvas = root.querySelector<HTMLCanvasElement>(".penney-game__canvas");
      const context = canvas?.getContext("2d");
      root.dataset.penneyInitialized = "true";
      if (canvas && context) {
        new PenneyGame(root, canvas, context);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePenneyGames, { once: true });
  } else {
    initializePenneyGames();
  }
})();
