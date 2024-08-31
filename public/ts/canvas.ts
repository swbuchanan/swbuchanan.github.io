// canvas.ts

function pointDifference(p1: Point, p2: Point): Point {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

function pointSum(p1: Point, p2: Point): Point {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

function scalarMultiply(p: Point, r: number): Point {
  return new Point(p1.x*r, p2.x*r);
}

function dotProduct(p1: Point, p2: Point): number {
  return p1.x*p2.x + p1.y*p2.y;
}

function norm(point: Point): number {
  return Math.sqrt(point.x*point.x + point.y*point.y);
}

function normalize(point: Point): Point {
  return scalarMultiply(point, 1/norm(point));
}

function distance(point1: Point, point2: Point): number {
  return norm(pointDifference(point1, point2));
}

class Point {
  constructor(public x: number, public y: number) {}
}

class CanvasCurve {
  private points: Point[] = [];
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
    this.drawCurve();
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

