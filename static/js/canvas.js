// canvas.ts
function pointDifference(p1, p2) {
    console.log(p1);
    return new Point(p1.x - p2.x, p1.y - p2.y);
}
function pointSum(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}
function scalarMultiply(p, r) {
    return new Point(p.x * r, p.y * r);
}
function dotProduct(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}
function norm(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
}
function normalize(point) {
    return new Point(scalarMultiply(point, 1 / norm(point)).x, scalarMultiply(point, 1 / norm(point)).y);
}
function distance(point1, point2) {
    return norm(pointDifference(point1, point2));
}
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
        this.normals = [];
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.addPoint.bind(this));
        var clearButton = document.getElementById("clearButton");
        clearButton.addEventListener("click", this.clearPoints.bind(this));
    }
    CanvasCurve.prototype.addPoint = function (event) {
        var rect = this.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        this.points.push(new Point(x, y));
        this.normals.push(new Point(0, 0));
        if (this.points.length > 2) {
            for (var i = 0; i < this.points.length; i++) {
                //this.normals[i] = this.calculateNormal(i);
                continue;
            }
        }
        this.drawCurve();
    };
    CanvasCurve.prototype.calculateNormal = function (idx) {
        if (this.points.length < 3)
            return;
        var left_idx;
        var right_idx;
        if (idx == 0) {
            left_idx = this.points.length - 1;
        }
        else {
            left_idx = idx - 1;
        }
        right_idx = (idx + 1) % this.points.length;
        var difference_to_left = new Point(0, 0);
        var difference_to_right = new Point(0, 0);
        var bisector = new Point(0, 0);
        difference_to_left = pointDifference(this.points[idx - 1], this.points[idx]);
        difference_to_right = pointDifference(this.points[idx + 1], this.points[idx]);
        var kappa = 1;
        bisector = normalize(pointSum(normalize(difference_to_left), normalize(difference_to_right)));
        bisector = scalarMultiply(bisector, kappa);
        return new Point(bisector.x, bisector.y);
    };
    CanvasCurve.prototype.drawCurve = function () {
        if (this.points.length < 1)
            return;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 1; i < this.points.length; i++) {
            this.context.lineTo(this.points[i].x, this.points[i].y);
        }
        this.context.lineTo(this.points[0].x, this.points[0].y);
        this.context.strokeStyle = "black";
        this.context.lineWidth = 2;
        this.context.stroke();
    };
    CanvasCurve.prototype.drawNormals = function () {
        if (this.points.length < 3)
            return;
        this.context.beginPath();
        for (var i = 0; i < this.normals.length; i++) {
            this.context.moveTo(this.points[i].x, this.points[i].y);
            this.context.lineTo(this.points[i].x + this.normals[i].x, this.points[i].y + this.normals[i].y);
            this.context.strokeStyle = "blue";
            this.context.lineWidth = 1;
            this.context.stroke();
        }
    };
    CanvasCurve.prototype.clearPoints = function () {
        this.points = []; // Clear the points array
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    };
    return CanvasCurve;
}());
// Initialize the canvas curve when the page loads
document.addEventListener("DOMContentLoaded", function () {
    var canvasCurve = new CanvasCurve("myCanvas");
    console.log("created a canvas");
});
