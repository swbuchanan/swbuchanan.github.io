var HandMatrix = /** @class */ (function () {
    function HandMatrix(canvasId) {
        this.selectedHands = [];
        this.cardStrings = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        this.handStringMatrix = [];
        this.cellSize = 40;
        for (var i = 0; i < this.cardStrings.length; i++) {
            var row = [];
            var otherrow = [];
            for (var j = 0; j < this.cardStrings.length; j++) {
                if (i === j) {
                    // Pairs (e.g., AA, KK)
                    row.push("" + this.cardStrings[i] + this.cardStrings[j]);
                }
                else if (i < j) {
                    // Suited hands (e.g., AKs, AQs)
                    row.push("" + this.cardStrings[i] + this.cardStrings[j] + "s");
                }
                else {
                    // Offsuit hands (e.g., AKo, KQo)
                    row.push("" + this.cardStrings[j] + this.cardStrings[i] + "o");
                }
                otherrow.push(0);
            }
            this.handStringMatrix.push(row);
            this.selectedHands.push(otherrow);
        }
        console.log(this.handStringMatrix);
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.clickHand.bind(this));
        this.cellSize = this.canvas.width / 13;
    }
    HandMatrix.prototype.clickHand = function (event) {
        var rect = this.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var handIdxX = Math.floor(x / this.cellSize);
        var handIdxY = Math.floor(y / this.cellSize);
        console.log(this.handStringMatrix[handIdxY][handIdxX]);
        this.selectedHands[handIdxY][handIdxX] = (this.selectedHands[handIdxY][handIdxX] + 1) % 2;
        this.drawMatrix();
    };
    HandMatrix.prototype.drawMatrix = function () {
        var _this = this;
        var cellSize = this.cellSize; // Size of each cell in the matrix
        var padding = 0; // Padding around text in each cell
        this.context.font = '16px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.handStringMatrix.forEach(function (row, rowIndex) {
            row.forEach(function (hand, colIndex) {
                var x = colIndex * cellSize + padding;
                var y = rowIndex * cellSize + padding;
                _this.context.fillStyle = 'white';
                if (_this.selectedHands[rowIndex][colIndex] === 1) {
                    _this.context.fillStyle = 'red';
                }
                _this.context.fillRect(x, y, cellSize, cellSize); // Draw cell border
                _this.context.fillStyle = 'black';
                _this.context.fillText(hand, x + cellSize / 2, y + cellSize / 2); // Draw hand text
            });
        });
    };
    return HandMatrix;
}());
document.addEventListener("DOMContentLoaded", function () {
    console.log("poker hand matrix v4 loaded");
    var handMatrix = new HandMatrix("myPokerHandMatrix"); // this name is determined by what??
    handMatrix.drawMatrix();
});
