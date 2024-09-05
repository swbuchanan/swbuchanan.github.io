// canvas.ts
function pointDifference(p1, p2) {
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
// Some things will need to be updated if I ever want to have more than one curve per canvas
// I guess I should have a separate class that is just for canvases, and make this one just for curves
var CanvasCurve = /** @class */ (function () {
    function CanvasCurve(canvasId) {
        var _this = this;
        this.points = [];
        this.normals = [];
        this.animationRunning = false;
        this.animationId = null;
        this.animate = function () {
            console.log("animating");
            _this.flowStep();
            if (_this.animationRunning) {
                _this.animationId = requestAnimationFrame(_this.animate);
            }
        };
        console.log("creating a canvascurve");
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.addPoint.bind(this));
        var clearButton = document.getElementById("canvasCurveClearButton");
        clearButton.addEventListener("click", this.clearPoints.bind(this));
        var stepButton = document.getElementById("canvasCurveStepButton");
        stepButton.addEventListener("click", this.flowStep.bind(this));
        var toggleButton = document.getElementById("canvasCurveToggleButton");
        toggleButton.addEventListener("click", function () {
            _this.toggleAnimation();
            //toggleButton.textContent = this.animationRunning ? "Stop Animation" : "Start Animation";
        });
        this.flowStep = this.flowStep.bind(this);
    }
    CanvasCurve.prototype.addPoint = function (event) {
        console.log("uaoeu");
        // get the position of the mouse
        var rect = this.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        // don't add the same point twice
        if (this.points.length > 1 && this.points[this.points.length - 1].x == x && this.points[this.points.length - 1].y == y) {
            console.log("go away");
            return;
        }
        this.points.push(new Point(x, y));
        this.normals.push(new Point(0, 0));
        if (this.points.length > 2) {
            for (var i = 0; i < this.points.length; i++) {
                this.normals[i] = this.calculateNormal(i);
                continue;
            }
        }
        this.drawCurve();
        this.drawNormals();
    };
    CanvasCurve.prototype.calculateFlowStep = function () {
        var new_points = [];
        for (var i = 0; i < this.points.length; i++) {
            var new_point_x = this.points[i].x + this.normals[i].x;
            var new_point_y = this.points[i].y + this.normals[i].y;
            var newPoint = new Point(new_point_x, new_point_y);
            if (!(distance(newPoint, this.points[(i + 1) % this.points.length]) < 1)) {
                new_points.push(newPoint);
            }
        }
        if (new_points.length < 3) {
            this.clearPoints();
            return [];
        }
        return new_points;
    };
    CanvasCurve.prototype.flowStep = function () {
        if (this.points.length < 3) {
            this.clearPoints();
            return;
        }
        this.points = this.calculateFlowStep(); // move all the points
        this.normals = [];
        // calculate all the new normal vectors of the moved points
        for (var i = 0; i < this.points.length; i++) {
            var new_normal = this.calculateNormal(i);
            this.normals.push(new Point(new_normal.x, new_normal.y));
        }
        this.drawCurve();
        this.drawNormals();
    };
    CanvasCurve.prototype.calculateNormal = function (idx) {
        if (this.points.length < 2)
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
        difference_to_left = pointDifference(this.points[left_idx], this.points[idx]);
        difference_to_right = pointDifference(this.points[right_idx], this.points[idx]);
        var kappa = Math.abs(Math.PI - Math.acos(dotProduct(difference_to_left, difference_to_right) / norm(difference_to_left) / norm(difference_to_right)));
        bisector = normalize(pointSum(normalize(difference_to_left), normalize(difference_to_right)));
        bisector = scalarMultiply(bisector, .5 * kappa);
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
        if (this.points.length < 2)
            return;
        this.context.beginPath();
        for (var i = 0; i < this.normals.length; i++) {
            this.context.moveTo(this.points[i].x, this.points[i].y);
            this.context.lineTo(this.points[i].x + 20 * this.normals[i].x, this.points[i].y + 20 * this.normals[i].y); // normal vectors need to be scaled up for visibility
            this.context.strokeStyle = "blue";
            this.context.lineWidth = 1;
            this.context.stroke();
        }
    };
    CanvasCurve.prototype.clearPoints = function () {
        this.points = [];
        this.normals = [];
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
        this.animationRunning = false;
    };
    CanvasCurve.prototype.toggleAnimation = function () {
        this.animationRunning = !this.animationRunning;
        if (this.animationRunning) {
            this.animate();
        }
        else {
            if (this.animationId !== null) {
                cancelAnimationFrame(this.animationId);
            }
        }
    };
    return CanvasCurve;
}());
// Initialize the canvas curve when the page loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("csf loaded");
    var canvasCurve = new CanvasCurve("myCanvas");
});
console.log("4");
