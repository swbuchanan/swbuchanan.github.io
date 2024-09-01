"use strict";
exports.__esModule = true;
function pointDifference(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}
exports.pointDifference = pointDifference;
function pointSum(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}
exports.pointSum = pointSum;
function scalarMultiply(p, r) {
    return new Point(p.x * r, p.y * r);
}
exports.scalarMultiply = scalarMultiply;
function dotProduct(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}
exports.dotProduct = dotProduct;
function norm(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
}
exports.norm = norm;
function normalize(point) {
    return new Point(scalarMultiply(point, 1 / norm(point)).x, scalarMultiply(point, 1 / norm(point)).y);
}
exports.normalize = normalize;
function distance(point1, point2) {
    return norm(pointDifference(point1, point2));
}
exports.distance = distance;
