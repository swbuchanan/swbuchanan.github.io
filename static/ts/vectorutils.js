"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointDifference = pointDifference;
exports.pointSum = pointSum;
exports.scalarMultiply = scalarMultiply;
exports.dotProduct = dotProduct;
exports.norm = norm;
exports.normalize = normalize;
exports.distance = distance;
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
