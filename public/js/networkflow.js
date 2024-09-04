function getMousePosition(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [x, y];
}
var isRightClicking = false;
function drawLine(startX, startY, endX, endY, lineWidth, lineColor, ctx) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
}
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
        this.draggingVertex = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.animate = function () {
            _this.flowStep();
            if (_this.drawingEdge) {
                drawLine(_this.vertices[_this.edgeStartIdx].x, _this.vertices[_this.edgeStartIdx].y, _this.mouseX, _this.mouseY, 1, "green", _this.context);
            }
            if (_this.animationRunning) {
                _this.animationId = requestAnimationFrame(_this.animate);
            }
        };
        console.log("created a canvasGraph v4");
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        //    this.canvas.addEventListener("click", this.addPoint.bind(this));
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
            var _a;
            var _b = getMousePosition(event, _this.canvas), mouseX = _b[0], mouseY = _b[1];
            _a = getMousePosition(event, _this.canvas), _this.mouseX = _a[0], _this.mouseY = _a[1];
            if (_this.drawingEdge) {
                _this.clearJunk();
                drawLine(_this.vertices[_this.edgeStartIdx].x, _this.vertices[_this.edgeStartIdx].y, mouseX, mouseY, 1, "green", _this.context);
            }
            if (_this.draggingVertex) {
                _this.vertices[_this.draggingVertexIdx].x = mouseX;
                _this.vertices[_this.draggingVertexIdx].y = mouseY;
                _this.clearJunk();
            }
            var vertexidx = _this.isMouseOverVertex(mouseX, mouseY);
            if (vertexidx !== false) {
                _this.highlightVertex(vertexidx);
            }
            else {
                // TODO:
                // I guess it's not efficient to be redrawing the canvas this often
                if (!_this.drawingEdge) {
                    _this.clearJunk();
                }
            }
        });
        this.canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); }); // keep the context menu from coming up on a right click
        // Add a mousedown event listener to the canvas
        this.canvas.addEventListener('mousedown', function (event) {
            // event.preventDefault();
            // get the position of the mouse
            var _a = getMousePosition(event, _this.canvas), x = _a[0], y = _a[1];
            // check if there is a vertex under the mouse
            // this returns the index of the vertex if such a vertex exists, and false otherwise
            var vertexUnderMouseIdx = _this.isMouseOverVertex(x, y);
            if (event.button == 0) { // left click
                if (vertexUnderMouseIdx === false) { // add a vertex if we didn't just click on one
                    _this.addPoint(event);
                }
                else { // if we did just click on a vertex we start dragging it
                    _this.draggingVertex = true;
                    _this.draggingVertexIdx = vertexUnderMouseIdx;
                }
            }
            if (event.button == 2) { //right click
                // Prevent the default context menu from appearing
                event.preventDefault();
                isRightClicking = true;
                // If we right clicked on a vertex we should start drawing a line
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
            var _a = getMousePosition(event, _this.canvas), mouseX = _a[0], mouseY = _a[1];
            if (event.button === 0) { // left click
                _this.draggingVertex = false;
            }
            if (event.button === 2) { // right click
                isRightClicking = false; // Set the flag to false
                // if we were drawing an edge and we released right click on another vertex we should create the edge between these two vertices
                if (_this.drawingEdge) {
                    _this.drawingEdge = false;
                    var vertex_idx = _this.isMouseOverVertex(mouseX, mouseY);
                    if (vertex_idx !== false) {
                        if (vertex_idx === _this.edgeStartIdx) { // if we were drawing an edge and we released right click on the same vertex we should remove that vertex
                            _this.removeVertex(vertex_idx);
                        }
                        else {
                            _this.addEdge(_this.edgeStartIdx, vertex_idx);
                        }
                        _this.clearJunk();
                    }
                }
            }
        });
        this.flowStep = this.flowStep.bind(this);
    }
    CanvasGraph.prototype.removeVertex = function (idx) {
        console.log("I am removing vertex ", idx);
        this.vertices.splice(idx, 1); // remove the vertex
        this.normals.splice(idx, 1); // remove its normal vector
        var removedVertices = [];
        // remove the edges connected to it and re-index the remaining edges
        for (var i = this.edges.length - 1; i >= 0; i--) { // we have to traverse the list backwards since it is changing size
            if (this.edges[i][0] === idx || this.edges[i][1] === idx) {
                for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
                    var edge = _a[_i];
                    console.log(edge);
                }
                removedVertices.push(idx);
                this.edges.splice(i, 1);
                for (var _b = 0, _c = this.edges; _b < _c.length; _b++) {
                    var edge = _c[_b];
                    console.log(edge);
                }
            }
        }
        // re-indexing
        for (var _d = 0, _e = this.edges; _d < _e.length; _d++) {
            var edge = _e[_d];
            if (edge[0] >= idx)
                edge[0]--;
            if (edge[1] >= idx)
                edge[1]--;
        }
        // (re)calculate all normal vectors for vectors that have edges
        for (var _f = 0, _g = this.edges; _f < _g.length; _f++) {
            var edge = _g[_f];
            this.normals[edge[0]] = this.calculateNormal(edge[0]);
            this.normals[edge[1]] = this.calculateNormal(edge[1]);
        }
    };
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
        //console.log("normals: ", this.normals);
        if (this.normals.length === 0) {
            console.log("no normals");
            return this.vertices;
        }
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
    // calculate and apply a timestep of the network flow
    CanvasGraph.prototype.flowStep = function () {
        this.vertices = this.calculateFlowStep(); // move all the points
        this.normals = [];
        // calculate all the new normal vectors of the moved points
        for (var i = 0; i < this.vertices.length; i++) {
            var new_normal = this.calculateNormal(i);
            this.normals.push(new Point(new_normal.x, new_normal.y));
        }
        this.clearJunk();
    };
    // calculate the normal vector of the vertex at the given index
    CanvasGraph.prototype.calculateNormal = function (idx) {
        // for now this is just the sum of all the edges connected to a vertex
        var normal = new Point(0, 0);
        var neighbors = 0;
        var vertex = this.vertices[idx];
        // add up all the vectors defined by the edges that are connected to this vertex
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
    // draw a circle around a vertex if our mouse is over it
    // TODO: this doesn't work as intended when the animation is going
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
        this.animationRunning = false;
        this.clearJunk();
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
    console.log("network flow thing");
    var canvasCurve = new CanvasGraph("networkFlowCanvas");
});
