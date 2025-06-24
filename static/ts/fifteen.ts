
class Game {
    private board: number[][];
    private emptyTile: { row: number; col: number };
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private reverseControls: boolean = false;
    private boardSize: number = 4; // Default board size

    constructor(canvasId: string) {
        const configElement = document.getElementById('game-config') as HTMLDivElement;
        let defaultSetup: boolean = false;
        if (configElement) {
            const sizeAttr = configElement.getAttribute('data-size');
            defaultSetup = configElement.getAttribute('data-default-setup') === 'true';
            this.boardSize = sizeAttr ? parseInt(sizeAttr, 10) : 4; // Default to 4x4
        } else {
            console.error('Game configuration element not found');
        }

        if (defaultSetup) {
            this.board = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 0] // 0 represents the empty tile
            ];
            this.emptyTile = { row: 3, col: 3 };
        } else {
            this.board = [
                [15, 14, 13, 12],
                [8, 9, 10, 11],
                [5, 7, 6, 0],
                [1, 2, 4, 3] // 0 represents the empty tile
            ];
            this.emptyTile = { row: 2, col: 3 };
        }

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error("Failed to get canvas context");
        }
        window.addEventListener('keydown', (event) => {
            // Prevent default arrow key behavior (scrolling)
            event.preventDefault();
            // Handle key down events for tile movement
            this.handleKeyDown(event);
        });

        const reverseCheckbox = document.getElementById('reverseToggle') as HTMLInputElement;
        reverseCheckbox.addEventListener('change', () => {
            console.log('Reverse controls:', reverseCheckbox.checked);
            this.reverseControls = reverseCheckbox.checked;
        });



    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.key;
        let moved = false;

        switch (key) {
            case this.reverseControls ? 'ArrowDown' : 'ArrowUp':
                moved = this.moveTile(this.emptyTile.row + 1, this.emptyTile.col);
                console.log('up', moved);
                break;
            case this.reverseControls ? 'ArrowUp' : 'ArrowDown':
                moved = this.moveTile(this.emptyTile.row - 1, this.emptyTile.col);
                break;
            case this.reverseControls ? 'ArrowRight' : 'ArrowLeft':
                moved = this.moveTile(this.emptyTile.row, this.emptyTile.col + 1);
                break;
            case this.reverseControls ? 'ArrowLeft' : 'ArrowRight':
                moved = this.moveTile(this.emptyTile.row, this.emptyTile.col - 1);
                break;
        }

        if (moved) {
            this.draw();
        }
    }

    private moveTile(row: number, col: number): boolean {
        if (row < 0 || row >= 4 || col < 0 || col >= 4) {
            return false; // Out of bounds
        }
        if (this.board[row][col] != 0) {
            console.log(`Moving tile ${this.board[row][col]} to empty space at (${this.emptyTile.row}, ${this.emptyTile.col})`);
            // Swap the empty tile with the target tile
            this.board[this.emptyTile.row][this.emptyTile.col] = this.board[row][col];
            this.board[row][col] = 0;
            this.emptyTile.row = row;
            this.emptyTile.col = col;
            return true; // Move was successful
        }
        return false; // No move made
    }

    private draw(): void {
        if (!this.ctx) return;
        const tileSize = this.canvas.width / 4;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const tile = this.board[row][col];
                if (tile !== 0) { // Skip the empty tile
                    this.ctx.fillStyle = `hsl(${tile * 10}, 50%, 50%)`; // Color based on tile number
                    this.ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                    this.ctx.fillStyle = 'black';
                    this.ctx.font = '24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(tile.toString(), col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
                }
            }
        }
    }

    public gameLoop(): void {
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
}

const game = new Game('gameCanvas');
game.gameLoop();