// import * as Utils from './vectorutils';
// some nonsense is necessary to make this work
//class Point {
//  constructor(public x: number, public y: number) {}
//}
function getMousePosition(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [x, y];
}
var isRightClicking = false;
var CanvasGraph = /** @class */ (function () {
    function CanvasGraph(canvasId) {
        var _this = this;
        this.vertices = [];
        this.edges = [];
        this.normals = [];
        this.animationRunning = false;
        this.animationId = null;
        this.vertexRadius = 10; // for drawing vertices and collision detection
        this.drawingEdge = false;
        this.animate = function () {
            _this.flowStep();
            if (_this.animationRunning) {
                _this.animationId = requestAnimationFrame(_this.animate);
            }
        };
        console.log("created a canvasGraph v3");
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.addPoint.bind(this));
        var clearButton = document.getElementById("clearButton");
        clearButton.addEventListener("click", this.clearPoints.bind(this));
        var stepButton = document.getElementById("stepButton");
        stepButton.addEventListener("click", this.flowStep.bind(this));
        var toggleButton = document.getElementById("toggleButton");
        toggleButton.addEventListener("click", function () {
            _this.toggleAnimation();
            //toggleButton.textContent = this.animationRunning ? "Stop Animation" : "Start Animation";
        });
        this.canvas.addEventListener('mousemove', function (event) {
            var _a = getMousePosition(event, _this.canvas), mouseX = _a[0], mouseY = _a[1];
            var vertexidx = _this.isMouseOverVertex(mouseX, mouseY);
            if (vertexidx !== false) {
                _this.highlightVertex(vertexidx);
            }
            else {
                // TODO:
                // I guess it's not efficient to be redrawing the canvas this often
                _this.clearJunk();
            }
            if (_this.drawingEdge) {
                _this.context.beginPath();
                _this.context.moveTo(_this.vertices[_this.edgeStartIdx].x, _this.vertices[_this.edgeStartIdx].y);
                _this.context.lineTo(mouseX, mouseY);
                _this.context.lineWidth = 1;
                _this.context.strokeStyle = "green";
                _this.context.stroke();
            }
        });
        // Add a mousedown event listener to the canvas, although we are really only interested in right clicking
        this.canvas.addEventListener('mousedown', function (event) {
            event.preventDefault();
            console.log(event);
            if (event.button == 2) { //right click
                // get the position of the mouse
                var _a = getMousePosition(event, _this.canvas), x = _a[0], y = _a[1];
                // Prevent the default context menu from appearing
                event.preventDefault();
                isRightClicking = true;
                // If we right clicked on a vertex we should start drawing a line
                var vertexUnderMouseIdx = _this.isMouseOverVertex(x, y);
                if (vertexUnderMouseIdx !== false) {
                    _this.drawingEdge = true;
                    _this.edgeStartIdx = vertexUnderMouseIdx;
                }
                if (_this.isMouseOverVertex(x, y) !== false) {
                }
            }
        });
        // Add a mouseup event listener to detect when the right mouse button is released
        // what is window?
        window.addEventListener('mouseup', function (event) {
            console.log('mouse up');
            var _a = getMousePosition(event, _this.canvas), mouseX = _a[0], mouseY = _a[1];
            if (event.button === 2) { // Right mouse button
                isRightClicking = false; // Set the flag to false
                // if we were drawing an edge and we released right click on another vertex we should create the edge between these two vertices
                if (_this.drawingEdge) {
                    _this.drawingEdge = false;
                    var vertex_idx = _this.isMouseOverVertex(mouseX, mouseY);
                    if (vertex_idx !== false) {
                        _this.addEdge(_this.edgeStartIdx, vertex_idx);
                    }
                    _this.clearJunk();
                }
            }
        });
        this.flowStep = this.flowStep.bind(this);
    }
    // Method to check if the mouse is over any vertex
    CanvasGraph.prototype.isMouseOverVertex = function (mouseX, mouseY) {
        for (var idx = 0; idx < this.vertices.length; idx++) {
            var vertex = this.vertices[idx];
            var distance_1 = Math.sqrt(Math.pow((mouseX - vertex.x), 2) + Math.pow((mouseY - vertex.y), 2));
            if (distance_1 <= this.vertexRadius) {
                return idx; // Return the index of the vertex if the mouse is over it
            }
        }
        return false; // Return null if no vertex is under the mouse
    };
    // TODO: this should be called addVertex
    CanvasGraph.prototype.addPoint = function (event) {
        var _a = getMousePosition(event, this.canvas), x = _a[0], y = _a[1];
        this.vertices.push(new Point(x, y));
        this.normals.push(new Point(0, 0));
        this.drawCurve();
    };
    CanvasGraph.prototype.addEdge = function (idx1, idx2) {
        this.edges.push([idx1, idx2]);
        // (re)calculate all normal vectors for vectors that have edges
        for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            this.normals[edge[0]] = this.calculateNormal(edge[0]);
        }
    };
    CanvasGraph.prototype.calculateFlowStep = function () {
        var new_vertices = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var new_point_x = this.vertices[i].x + .02 * this.normals[i].x;
            var new_point_y = this.vertices[i].y + .02 * this.normals[i].y;
            var newPoint = new Point(new_point_x, new_point_y);
            new_vertices.push(newPoint);
            //      if (!(distance(newPoint, this.points[(i+1) % this.points.length]) < 1)){
            //        new_points.push(newPoint);
            //      }
        }
        if (new_vertices.length < 3) {
            this.clearPoints();
            return [];
        }
        return new_vertices;
    };
    CanvasGraph.prototype.flowStep = function () {
        if (this.vertices.length < 3) {
            this.clearPoints();
            return;
        }
        this.vertices = this.calculateFlowStep(); // move all the points
        this.normals = [];
        // calculate all the new normal vectors of the moved points
        for (var i = 0; i < this.vertices.length; i++) {
            var new_normal = this.calculateNormal(i);
            this.normals.push(new Point(new_normal.x, new_normal.y));
        }
        this.clearJunk();
        this.drawCurve();
    };
    CanvasGraph.prototype.calculateNormal = function (idx) {
        // for now this is just the sum of all the edges connected to a vertex
        var normal = new Point(0, 0);
        var neighbors = 0;
        var vertex = this.vertices[idx];
        for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            if (edge[0] == idx) {
                neighbors++;
                var difference = pointDifference(this.vertices[edge[1]], vertex);
                normal = pointSum(normal, difference);
            }
            else if (edge[1] == idx) {
                neighbors++;
                var difference = pointDifference(this.vertices[edge[0]], vertex);
                normal = pointSum(normal, difference);
            }
        }
        if (neighbors <= 1) {
            return new Point(0, 0);
        }
        else {
            return normal;
        }
    };
    /*
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
  
   */
    CanvasGraph.prototype.clearJunk = function () {
        // clear out everything and redraw only the curve
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
        this.drawCurve();
    };
    CanvasGraph.prototype.drawCurve = function () {
        var _this = this;
        // draw the vertices
        this.vertices.forEach(function (vertex) {
            _this.context.lineWidth = 1;
            _this.context.beginPath();
            _this.context.arc(vertex.x, vertex.y, _this.vertexRadius, 0, 2 * Math.PI);
            _this.context.fillStyle = "blue";
            _this.context.fill();
            _this.context.stroke();
        });
        // draw the edges
        for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            this.context.beginPath();
            this.context.moveTo(this.vertices[edge[0]].x, this.vertices[edge[0]].y);
            this.context.lineTo(this.vertices[edge[1]].x, this.vertices[edge[1]].y);
            this.context.strokeStyle = "blue";
            this.context.stroke();
        }
        this.drawNormals();
    };
    CanvasGraph.prototype.highlightVertex = function (idx) {
        var vertex = this.vertices[idx];
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(vertex.x, vertex.y, this.vertexRadius * 1.3, 0, 2 * Math.PI);
        this.context.strokeStyle = "green";
        this.context.stroke();
    };
    CanvasGraph.prototype.drawNormals = function () {
        for (var idx = 0; idx < this.normals.length; idx++) {
            var normal = this.normals[idx];
            if (normal.x != 0 || normal.y != 0) {
                this.context.beginPath();
                this.context.moveTo(this.vertices[idx].x, this.vertices[idx].y);
                this.context.lineTo(this.vertices[idx].x + .1 * this.normals[idx].x, this.vertices[idx].y + .1 * this.normals[idx].y);
                this.context.strokeStyle = "red";
                this.context.stroke();
            }
        }
    };
    CanvasGraph.prototype.clearPoints = function () {
        this.vertices = [];
        this.normals = [];
        this.edges = [];
    };
    CanvasGraph.prototype.toggleAnimation = function () {
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
    return CanvasGraph;
}());
// Initialize the canvas curve when the page loads
document.addEventListener("DOMContentLoaded", function () {
    var canvasCurve = new CanvasGraph("networkFlowCanvas");
});
