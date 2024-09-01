
export function pointDifference(p1: Point, p2: Point): Point {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function pointSum(p1: Point, p2: Point): Point {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function scalarMultiply(p: Point, r: number): Point {
  return new Point(p.x*r, p.y*r);
}

export function dotProduct(p1: Point, p2: Point): number {
  return p1.x*p2.x + p1.y*p2.y;
}

export function norm(point: Point): number {
  return Math.sqrt(point.x*point.x + point.y*point.y);
}

export function normalize(point: Point): Point {
  return new Point(scalarMultiply(point, 1/norm(point)).x, scalarMultiply(point, 1/norm(point)).y);
}

export function distance(point1: Point, point2: Point): number {
  return norm(pointDifference(point1, point2));
}

