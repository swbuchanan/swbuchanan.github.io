// canvas.ts

function pointDifference(p1: Point, p2: Point): Point {
  console.log(p1);

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

class CanvasCurve {
  private points: Point[] = [];
  private normals: Point[] = [];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;
    this.canvas.addEventListener("click", this.addPoint.bind(this));

    const clearButton = document.getElementById("clearButton")!;
    clearButton.addEventListener("click", this.clearPoints.bind(this));
  }

  private addPoint(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.points.push(new Point(x, y));
    this.normals.push(new Point(0,0));
    if (this.points.length > 2) {
      for (let i = 0; i < this.points.length; i++) {
        //this.normals[i] = this.calculateNormal(i);
        continue;
      }
    }
    this.drawCurve();
  }

  private calculateNormal(idx: number) {
    if (this.points.length < 3) return;
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
    difference_to_left = pointDifference(this.points[idx-1], this.points[idx])
    difference_to_right = pointDifference(this.points[idx+1], this.points[idx])
    let kappa = 1;
    bisector = normalize(pointSum(normalize(difference_to_left), normalize(difference_to_right)));
    bisector = scalarMultiply(bisector, kappa);
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
    if (this.points.length < 3) return;
    this.context.beginPath();
    for (let i = 0; i < this.normals.length; i++) {
      this.context.moveTo(this.points[i].x, this.points[i].y);
      this.context.lineTo(this.points[i].x + this.normals[i].x, this.points[i].y + this.normals[i].y);
      this.context.strokeStyle = "blue";
      this.context.lineWidth = 1;
      this.context.stroke();
    }
  }

  private clearPoints() {
    this.points = []; // Clear the points array
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
  }

}

// Initialize the canvas curve when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const canvasCurve = new CanvasCurve("myCanvas");
  console.log("created a canvas");
});

