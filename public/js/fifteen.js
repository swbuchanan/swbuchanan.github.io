var Game = /** @class */ (function () {
    function Game(canvasId) {
        var _this = this;
        this.reverseControls = false;
        this.boardSize = 4; // Default board size
        var configElement = document.getElementById('game-config');
        var defaultSetup = false;
        if (configElement) {
            var sizeAttr = configElement.getAttribute('data-size');
            defaultSetup = configElement.getAttribute('data-default-setup') === 'true';
            this.boardSize = sizeAttr ? parseInt(sizeAttr, 10) : 4; // Default to 4x4
        }
        else {
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
        }
        else {
            this.board = [
                [15, 14, 13, 12],
                [8, 9, 10, 11],
                [5, 7, 6, 0],
                [1, 2, 4, 3] // 0 represents the empty tile
            ];
            this.emptyTile = { row: 2, col: 3 };
        }
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error("Failed to get canvas context");
        }
        window.addEventListener('keydown', function (event) {
            // Prevent default arrow key behavior (scrolling)
            event.preventDefault();
            // Handle key down events for tile movement
            _this.handleKeyDown(event);
        });
        var reverseCheckbox = document.getElementById('reverseToggle');
        reverseCheckbox.addEventListener('change', function () {
            console.log('Reverse controls:', reverseCheckbox.checked);
            _this.reverseControls = reverseCheckbox.checked;
        });
    }
    Game.prototype.handleKeyDown = function (event) {
        var key = event.key;
        var moved = false;
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
    };
    Game.prototype.moveTile = function (row, col) {
        if (row < 0 || row >= 4 || col < 0 || col >= 4) {
            return false; // Out of bounds
        }
        if (this.board[row][col] != 0) {
            console.log("Moving tile ".concat(this.board[row][col], " to empty space at (").concat(this.emptyTile.row, ", ").concat(this.emptyTile.col, ")"));
            // Swap the empty tile with the target tile
            this.board[this.emptyTile.row][this.emptyTile.col] = this.board[row][col];
            this.board[row][col] = 0;
            this.emptyTile.row = row;
            this.emptyTile.col = col;
            return true; // Move was successful
        }
        return false; // No move made
    };
    Game.prototype.draw = function () {
        if (!this.ctx)
            return;
        var tileSize = this.canvas.width / 4;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                var tile = this.board[row][col];
                if (tile !== 0) { // Skip the empty tile
                    this.ctx.fillStyle = "hsl(".concat(tile * 10, ", 50%, 50%)"); // Color based on tile number
                    this.ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                    this.ctx.fillStyle = 'black';
                    this.ctx.font = '24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(tile.toString(), col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
                }
            }
        }
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.draw();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
var game = new Game('gameCanvas');
game.gameLoop();
