// import * as Utils from './vectorutils';
// some nonsense is necessary to make this work

//class Point {
//  constructor(public x: number, public y: number) {}
//}

function getMousePosition(event: MouseEvent, canvas: HTMLCanvasElement): [number, number] {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x,y];
}

let isRightClicking = false;

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
  private edgeStartIdx: number; // the index of the vertex where we are starting to draw an edge

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;
    this.canvas.addEventListener("click", this.addPoint.bind(this));

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

      const vertexidx = this.isMouseOverVertex(mouseX, mouseY);
      if (vertexidx !== false) {
        this.highlightVertex(vertexidx);
      } else {
        // TODO:
        // I guess it's not efficient to be redrawing the canvas this often
        this.clearJunk();
      }

      if (this.drawingEdge) {
        this.context.beginPath();
        this.context.moveTo(this.vertices[this.edgeStartIdx].x, this.vertices[this.edgeStartIdx].y);
        this.context.lineTo(mouseX, mouseY);
        this.context.lineWidth = 1;
        this.context.strokeStyle = "green";
        this.context.stroke();
      }

    });

    // Add a right-click event listener to the canvas
    this.canvas.addEventListener('contextmenu', (event: MouseEvent) => {
      // get the position of the mouse
      const [x,y] = getMousePosition(event, this.canvas);

      // Prevent the default context menu from appearing
      event.preventDefault();

      isRightClicking = true;

      // If we right clicked on a vertex we should start drawing a line
      const vertexUnderMouseIdx = this.isMouseOverVertex(x,y);
      if (vertexUnderMouseIdx !== false) {
        this.drawingEdge = true;
        this.edgeStartIdx = vertexUnderMouseIdx;
      }


      if (this.isMouseOverVertex(x,y) !== false) {
        console.log("clicked on vertex ", this.isMouseOverVertex(x,y));
      }

    });

    // Add a mouseup event listener to detect when the right mouse button is released
    // what is window?
    window.addEventListener('mouseup', (event: MouseEvent) => {
      const [mouseX, mouseY] = getMousePosition(event, this.canvas);
      if (event.button === 2) { // Right mouse button
        isRightClicking = false; // Set the flag to false
        
        // if we were drawing an edge and we released right click on another vertex we should create the edge between these two vertices
        if (this.drawingEdge) {
          this.drawingEdge = false;
          const vertex_idx = this.isMouseOverVertex(mouseX, mouseY);
          if (vertex_idx !== false){
            this.addEdge(this.edgeStartIdx, vertex_idx);
            console.log('added edge between vertex ', this.edgeStartIdx, ' and vertex ', vertex_idx);
          }
          this.clearJunk();
        }

        console.log('released right click');
      }
    });

    this.flowStep = this.flowStep.bind(this);
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

/*

  private calculateFlowStep(): Point[] {
  }

 */
  private flowStep() {
  }

  private calculateNormal(idx: number): Point {
    // for now this is just the sum of all the edges connected to a vertex
    let normal = new Point(0,0);
    let neighbors = 0;
    const vertex = this.vertices[idx];
    for (const edge of this.edges) {
      if (edge[0] == idx) {
        neighbors ++;
        normal = pointSum(normal, this.vertices[edge[1]]);
      } else if (edge[1] == idx) {
        neighbors ++;
        normal = pointSum(normal, this.vertices[edge[0]]);
      }
    }
    if (neighbors <= 1) {
      return new Point(0,0);
    } else {
      return normal;
    }
  }
  /*
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke();

 */
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
      this.context.stroke();
    });

    // draw the edges
    for (const edge of this.edges) {
      this.context.beginPath();
      this.context.moveTo(this.vertices[edge[0]].x, this.vertices[edge[0]].y);
      this.context.lineTo(this.vertices[edge[1]].x, this.vertices[edge[1]].y);
      this.context.strokeStyle = "blue";
      this.context.stroke();
    }

  }

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
        this.context.lineTo(this.vertices[idx].x + this.normals[idx].x, this.vertices[idx].y + this.normals[idx].y);
        this.context.strokeStyle = "blue";
        this.context.stroke(); 
      }
    }
  }

  private clearPoints() {
  }
 

  private animate = (): void => {
    this.flowStep();
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





