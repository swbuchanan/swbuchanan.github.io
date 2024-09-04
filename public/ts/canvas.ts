// canvas.ts

function pointDifference(p1: Point, p2: Point): Point {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

function pointSum(p1: Point, p2: Point): Point {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

function scalarMultiply(p: Point, r: number): Point {
  return new Point(p.x*r, p.y*r);
}

function dotProduct(p1: Point, p2: Point): number {
  return p1.x*p2.x + p1.y*p2.y;
}

function norm(point: Point): number {
  return Math.sqrt(point.x*point.x + point.y*point.y);
}

function normalize(point: Point): Point {
  return new Point(scalarMultiply(point, 1/norm(point)).x, scalarMultiply(point, 1/norm(point)).y);
}

function distance(point1: Point, point2: Point): number {
  return norm(pointDifference(point1, point2));
}

class Point {
  constructor(public x: number, public y: number) {}
}

// Some things will need to be updated if I ever want to have more than one curve per canvas
// I guess I should have a separate class that is just for canvases, and make this one just for curves
class CanvasCurve {
  private points: Point[] = [];
  private normals: Point[] = [];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private animationRunning: boolean = false;
  private animationId: number | null = null;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;
    this.canvas.addEventListener("click", this.addPoint.bind(this));

    const clearButton = document.getElementById("canvasCurveClearButton")!;
    clearButton.addEventListener("click", this.clearPoints.bind(this));

    const stepButton = document.getElementById("canvasCurveStepButton")!;
    stepButton.addEventListener("click", this.flowStep.bind(this));

    const toggleButton = document.getElementById("canvasCurveToggleButton")!;
    toggleButton.addEventListener("click", () => {
      this.toggleAnimation();
      //toggleButton.textContent = this.animationRunning ? "Stop Animation" : "Start Animation";
    });

    this.flowStep = this.flowStep.bind(this);
  }

  private addPoint(event: MouseEvent) {
    // get the position of the mouse
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // don't add the same point twice
    if (this.points.length > 1 && this.points[this.points.length-1].x == x && this.points[this.points.length-1].y == y) {

      return;
    }
    this.points.push(new Point(x, y));
    this.normals.push(new Point(0,0));
    if (this.points.length > 2) {
      for (let i = 0; i < this.points.length; i++) {
        this.normals[i] = this.calculateNormal(i);
        continue;
      }
    }
    this.drawCurve();
    this.drawNormals();
  }

  private calculateFlowStep(): Point[] {
    let new_points: Point[] = [];
    for (let i = 0; i < this.points.length; i++) {
      let new_point_x = this.points[i].x + this.normals[i].x;
      let new_point_y = this.points[i].y + this.normals[i].y;
      let newPoint = new Point(new_point_x, new_point_y);
      if (!(distance(newPoint, this.points[(i+1) % this.points.length]) < 1)){
        new_points.push(newPoint);
      }
    }
    if (new_points.length < 3) {
      this.clearPoints();
      return [];
    }
    return new_points;
  }

  private flowStep() {
    if (this.points.length < 3) {
      this.clearPoints();
      return;
    }
    this.points = this.calculateFlowStep(); // move all the points
    this.normals = [];

    // calculate all the new normal vectors of the moved points
    for (let i = 0; i < this.points.length; i++) {
      let new_normal = this.calculateNormal(i);
      this.normals.push(new Point(new_normal.x, new_normal.y));
    }
    this.drawCurve();
    this.drawNormals();
  }

  private calculateNormal(idx: number): Point {
    if (this.points.length < 2) return;
    let left_idx;
    let right_idx;
    if (idx == 0) {
      left_idx = this.points.length - 1;
    } else {
      left_idx = idx - 1;
    }
    right_idx = (idx + 1) % this.points.length;


    let difference_to_left = new Point(0,0);
    let difference_to_right = new Point(0,0);
    let bisector = new Point(0,0);
    difference_to_left = pointDifference(this.points[left_idx], this.points[idx])
    difference_to_right = pointDifference(this.points[right_idx], this.points[idx])
    let kappa = Math.abs(Math.PI - Math.acos(dotProduct(difference_to_left, difference_to_right)/norm(difference_to_left)/norm(difference_to_right)));
    bisector = normalize(pointSum(normalize(difference_to_left), normalize(difference_to_right)));
    bisector = scalarMultiply(bisector, .5*kappa);
    return new Point(bisector.x, bisector.y);
  }

  private drawCurve() {
    if (this.points.length < 1) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      this.context.lineTo(this.points[i].x, this.points[i].y);
    }

    this.context.lineTo(this.points[0].x, this.points[0].y);

    this.context.strokeStyle = "black";
    this.context.lineWidth = 2;
    this.context.stroke();
  }

  private drawNormals() {
    if (this.points.length < 2) return;
    this.context.beginPath();
    for (let i = 0; i < this.normals.length; i++) {
      this.context.moveTo(this.points[i].x, this.points[i].y);
      this.context.lineTo(this.points[i].x + 20*this.normals[i].x, this.points[i].y + 20*this.normals[i].y); // normal vectors need to be scaled up for visibility
      this.context.strokeStyle = "blue";
      this.context.lineWidth = 1;
      this.context.stroke();
    }
  }

  private clearPoints() {
    this.points = [];
    this.normals = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    this.animationRunning = false;
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
  console.log("csf loaded");
  const canvasCurve = new CanvasCurve("myCanvas");
});

console.log("4");

