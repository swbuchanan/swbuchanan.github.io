

function getMousePosition(event: MouseEvent, canvas: HTMLCanvasElement): [number, number] {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x,y];
}

let isRightClicking = false;

function drawLine(startX, startY, endX, endY, lineWidth, lineColor, ctx) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.stroke();
}

class CanvasGraph {
  private vertices: Point[] = [];
  private edges: number[][] = [];
  private normals: Point[] = [];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private animationRunning: boolean = false;
  private animationId: number | null = null;
  private vertexRadius = 10; // for drawing vertices and collision detection
  private drawingEdge = false;
  private draggingVertex = false;
  private draggingVertexIdx: number;
  private edgeStartIdx: number; // the index of the vertex where we are starting to draw an edge
  private mouseX = 0;
  private mouseY = 0;

  constructor(canvasId: string) {
    console.log("created a canvasGraph v4");
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;
//    this.canvas.addEventListener("click", this.addPoint.bind(this));

    const clearButton = document.getElementById("clearButton")!;
    clearButton.addEventListener("click", this.clearPoints.bind(this));

    const stepButton = document.getElementById("stepButton")!;
    stepButton.addEventListener("click", this.flowStep.bind(this));

    const toggleButton = document.getElementById("toggleButton")!;
    toggleButton.addEventListener("click", () => {
      this.toggleAnimation();
      //toggleButton.textContent = this.animationRunning ? "Stop Animation" : "Start Animation";
    });
    this.canvas.addEventListener('mousemove', (event) => {

      const [mouseX, mouseY] = getMousePosition(event, this.canvas);
      [this.mouseX, this.mouseY] = getMousePosition(event, this.canvas);

      if (this.drawingEdge) {
        this.clearJunk();
        drawLine(this.vertices[this.edgeStartIdx].x, this.vertices[this.edgeStartIdx].y, mouseX, mouseY, 1, "green", this.context);
      }

      if (this.draggingVertex) {
        this.vertices[this.draggingVertexIdx].x = mouseX;
        this.vertices[this.draggingVertexIdx].y = mouseY;
        this.clearJunk();
      }

      const vertexidx = this.isMouseOverVertex(mouseX, mouseY);
      if (vertexidx !== false) {
        this.highlightVertex(vertexidx);
      } else {
        // TODO:
        // I guess it's not efficient to be redrawing the canvas this often
        if (!this.drawingEdge){
          this.clearJunk();
        }
      }


    });

    this.canvas.addEventListener('contextmenu', (event: MouseEvent) => { event.preventDefault(); }); // keep the context menu from coming up on a right click

    // Add a mousedown event listener to the canvas
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      // event.preventDefault();

      // get the position of the mouse
      const [x,y] = getMousePosition(event, this.canvas);

      // check if there is a vertex under the mouse
      // this returns the index of the vertex if such a vertex exists, and false otherwise
      const vertexUnderMouseIdx = this.isMouseOverVertex(x,y);

      if (event.button == 0) { // left click
        if (vertexUnderMouseIdx === false) { // add a vertex if we didn't just click on one
          this.addPoint(event);
        } else { // if we did just click on a vertex we start dragging it
          this.draggingVertex = true;
          this.draggingVertexIdx = vertexUnderMouseIdx;
        }
      }

      if (event.button == 2) { //right click

        // Prevent the default context menu from appearing
        event.preventDefault();

        isRightClicking = true;

        // If we right clicked on a vertex we should start drawing a line
        if (vertexUnderMouseIdx !== false) {
          this.drawingEdge = true;
          this.edgeStartIdx = vertexUnderMouseIdx;
        }

        if (this.isMouseOverVertex(x,y) !== false) {

        }
      }
    });

    // Add a mouseup event listener to detect when the right mouse button is released
    // what is window?
    window.addEventListener('mouseup', (event: MouseEvent) => {
      const [mouseX, mouseY] = getMousePosition(event, this.canvas);

      if (event.button === 0) { // left click
        this.draggingVertex = false;
      }

      if (event.button === 2) { // right click
        isRightClicking = false; // Set the flag to false
        
        // if we were drawing an edge and we released right click on another vertex we should create the edge between these two vertices
        if (this.drawingEdge) {
          this.drawingEdge = false;
          const vertex_idx = this.isMouseOverVertex(mouseX, mouseY);
          if (vertex_idx !== false){
            if (vertex_idx === this.edgeStartIdx) { // if we were drawing an edge and we released right click on the same vertex we should remove that vertex
              this.removeVertex(vertex_idx);
            } else {
              this.addEdge(this.edgeStartIdx, vertex_idx);
            }
            this.clearJunk();
          }
        }

      }
    });

    this.flowStep = this.flowStep.bind(this);
  }

  private removeVertex(idx) {
    console.log("I am removing vertex ", idx);
    this.vertices.splice(idx, 1); // remove the vertex
    this.normals.splice(idx,1); // remove its normal vector
    let removedVertices = [];

    // remove the edges connected to it and re-index the remaining edges
    for (let i = this.edges.length - 1; i >= 0; i--) { // we have to traverse the list backwards since it is changing size
      if (this.edges[i][0] === idx || this.edges[i][1] === idx) {
        for (const edge of this.edges) console.log(edge);
        removedVertices.push(idx);
        this.edges.splice(i,1);
        for (const edge of this.edges) console.log(edge);
      }
    }
    
    // re-indexing
    for (const edge of this.edges) {
      if (edge[0] >= idx) edge[0] --;
      if (edge[1] >= idx) edge[1] --;
    }
    // (re)calculate all normal vectors for vectors that have edges
    for (const edge of this.edges) {
      this.normals[edge[0]] = this.calculateNormal(edge[0]);
      this.normals[edge[1]] = this.calculateNormal(edge[1]);
    }

  }
  
  // Method to check if the mouse is over any vertex
  isMouseOverVertex(mouseX: number, mouseY: number): number | false {
    for (let idx = 0; idx < this.vertices.length; idx ++) {
      const vertex = this.vertices[idx];
      const distance = Math.sqrt(
        (mouseX - vertex.x) ** 2 + (mouseY - vertex.y) ** 2
      );
      if (distance <= this.vertexRadius) {
        return idx; // Return the index of the vertex if the mouse is over it
      }
    }
    return false; // Return null if no vertex is under the mouse
  }

  // TODO: this should be called addVertex
  private addPoint(event: MouseEvent) { 
    const [x,y] = getMousePosition(event, this.canvas);
    this.vertices.push(new Point(x,y));
    this.normals.push(new Point(0,0));
    this.drawCurve();
  }

  private addEdge(idx1, idx2) {
    this.edges.push([idx1, idx2]);

    // (re)calculate all normal vectors for vectors that have edges
    for (const edge of this.edges) {
      this.normals[edge[0]] = this.calculateNormal(edge[0]);
    }
  }



  private calculateFlowStep(): Point[] {
    //console.log("normals: ", this.normals);
    if (this.normals.length === 0) {
      console.log("no normals");
      return this.vertices;
    }
    let new_vertices: Point[] = [];
    for (let i = 0; i < this.vertices.length; i++) {
      let new_point_x = this.vertices[i].x + .02*this.normals[i].x;
      let new_point_y = this.vertices[i].y + .02*this.normals[i].y;
      let newPoint = new Point(new_point_x, new_point_y);
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
  }
  


  // calculate and apply a timestep of the network flow
  private flowStep() {
    this.vertices = this.calculateFlowStep(); // move all the points
    this.normals = [];

    // calculate all the new normal vectors of the moved points
    for (let i = 0; i < this.vertices.length; i++) {
      let new_normal = this.calculateNormal(i);
      this.normals.push(new Point(new_normal.x, new_normal.y));
    }

    this.clearJunk();
  }

  // calculate the normal vector of the vertex at the given index
  private calculateNormal(idx: number): Point {
    // for now this is just the sum of all the edges connected to a vertex
    let normal = new Point(0,0);
    let neighbors = 0;
    const vertex = this.vertices[idx];

    // add up all the vectors defined by the edges that are connected to this vertex
    for (const edge of this.edges) {
      if (edge[0] == idx) {
        neighbors ++;
        let difference = pointDifference(this.vertices[edge[1]], vertex);
        normal = pointSum(normal, difference);
      } else if (edge[1] == idx) {
        neighbors ++;
        let difference = pointDifference(this.vertices[edge[0]], vertex);
        normal = pointSum(normal, difference);
      }
    }
    if (neighbors <= 1) {
      return new Point(0,0);
    } else {

      return normal;
    }
  }

  private clearJunk() {
    // clear out everything and redraw only the curve
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    this.drawCurve();
  }

  private drawCurve() {
    // draw the vertices
    this.vertices.forEach((vertex) => {
      this.context.lineWidth = 1;
      this.context.beginPath();
      this.context.arc(vertex.x, vertex.y, this.vertexRadius, 0, 2 * Math.PI);
      this.context.fillStyle = "blue";
      this.context.fill();
    });

    // draw the edges
    for (const edge of this.edges) {
      this.context.beginPath();
      this.context.moveTo(this.vertices[edge[0]].x, this.vertices[edge[0]].y);
      this.context.lineTo(this.vertices[edge[1]].x, this.vertices[edge[1]].y);
      this.context.strokeStyle = "blue";
      this.context.stroke();
    }

    this.drawNormals();
  }

  // draw a circle around a vertex if our mouse is over it
  // TODO: this doesn't work as intended when the animation is going
  private highlightVertex(idx: number) {
    const vertex = this.vertices[idx];

    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.arc(vertex.x, vertex.y, this.vertexRadius*1.3, 0, 2 * Math.PI);
    this.context.strokeStyle = "green";
    this.context.stroke();
  }


  private drawNormals() {
    for (let idx = 0; idx < this.normals.length; idx ++) {
      const normal = this.normals[idx];
      if (normal.x != 0 || normal.y != 0) {
        this.context.beginPath();
        this.context.moveTo(this.vertices[idx].x, this.vertices[idx].y);
        this.context.lineTo(this.vertices[idx].x + .1*this.normals[idx].x, this.vertices[idx].y + .1*this.normals[idx].y);
        this.context.strokeStyle = "red";
        this.context.stroke(); 
      }
    }
  }

  private clearPoints() {
    this.vertices = [];
    this.normals = [];
    this.edges = [];
    this.animationRunning = false;
    this.clearJunk();
  }
 

  private animate = (): void => {
    this.flowStep();
    if (this.drawingEdge) {
      drawLine(this.vertices[this.edgeStartIdx].x, this.vertices[this.edgeStartIdx].y, this.mouseX, this.mouseY, 1, "green", this.context);
    }
    if (this.animationRunning) {
      this.animationId = requestAnimationFrame(this.animate);
    }
  }

  private toggleAnimation(): void {
    this.animationRunning = !this.animationRunning;
    if (this.animationRunning) {
      this.animate();
    } else {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

}

// Initialize the canvas curve when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const canvasCurve = new CanvasGraph("networkFlowCanvas");
});





