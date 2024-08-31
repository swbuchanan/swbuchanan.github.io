// canvas.ts
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var CanvasCurve = /** @class */ (function () {
    function CanvasCurve(canvasId) {
        this.points = [];
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.addPoint.bind(this));
    }
    CanvasCurve.prototype.addPoint = function (event) {
        var rect = this.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        this.points.push(new Point(x, y));
        this.drawCurve();
    };
    CanvasCurve.prototype.drawCurve = function () {
        if (this.points.length < 2)
            return;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 1; i < this.points.length; i++) {
            this.context.lineTo(this.points[i].x, this.points[i].y);
        }
        this.context.strokeStyle = "black";
        this.context.lineWidth = 2;
        this.context.stroke();
    };
    return CanvasCurve;
}());
// Initialize the canvas curve when the page loads
document.addEventListener("DOMContentLoaded", function () {
    var canvasCurve = new CanvasCurve("myCanvas");
});
