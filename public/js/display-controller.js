import CanvasController from './canvas-controller.js';
import { palette } from './color.js';

// I guess maybe it doesn't make sense to make this a controller since it isn't generally interactive?


export default class DisplayController extends CanvasController {

    constructor(id, width, height) {
        super(id, width, height);
        // [ {x, y} ]
        this.points = [];
        this.pathEndIndex = 0;
        this.curUndoIndex = 0;
        // Lengths of the paths after we've undone to certain points
        this.undoIndexes = [0];
        this.drawing = false;
        this.onDrawingStart = [];
        this.onDrawingEnd = [];
        this.paramShift = 0;
        console.log('display controller constructed');
    }

    get path() {
        return this.points.slice(0, this.pathEndIndex);
    }

    setPoints(points) {
        this.points = points;
    }

    graphCoordsToCanvasCoords(coords) {
        // Assuming that the center of the canvas is (0,0) on the graph
        const canvasPosition = this.canvas.getBoundingClientRect();
        const actualWidth = (canvasPosition.right - canvasPosition.left) - 2;
        const actualHeight = (canvasPosition.top - canvasPosition.bottom) - 2; // -2 ?
        // const scale = this.width / actualWidth;
        const graphScale = 20;
        let canvasX = actualWidth/2 + graphScale*coords[0];
        let canvasY = actualWidth/2 - graphScale*coords[1];
        console.log(`converted ${coords} to ${[canvasX, canvasY]}`);
        return [canvasX, canvasY];
    }

    drawParametricFunction(func, paramStart, paramEnd, numSegments) {
        const canvasPosition = this.canvas.getBoundingClientRect();
        const actualWidth = (canvasPosition.right - canvasPosition.left) - 2;
        const scale = this.width / actualWidth;
        // func should be a function that takes in a number and returns a tuple
        const dt = (paramEnd - paramStart)/numSegments;
        for (let t = paramStart; t < paramEnd; t += dt) {
            const point = {
                  x: scale * (this.graphCoordsToCanvasCoords(func(t))[0]),
                  y: scale * (this.graphCoordsToCanvasCoords(func(t))[1])
            }
            console.log(point);
            this.points.push(point);
            this.pathEndIndex = this.points.length;
        }
        console.log(this.points);
    }


    update(dt, mousePosition) {
        if (!mousePosition || !this.drawing) {
            return;
        }
        this.paramShift += .01
        this.drawParametricFunction(t => [t, 10*Math.cos(t)], -10+this.paramShift,10+this.paramShift, 300);

        const canvasPosition = this.canvas.getBoundingClientRect();
        // we have to account for the border here too
        const actualWidth = (canvasPosition.right - canvasPosition.left) - 2;
        // 500 being the 'default' width
        const scale = this.width / actualWidth;
        const point = {
            x: scale * (mousePosition.x - canvasPosition.x),
            y: scale * (mousePosition.y - canvasPosition.y),
        }
        if (this.points.length == 0) {
            this.points.push(point);
            this.pathEndIndex = this.points.length;
        }
        else {
            // only add it if it's far enough away from the last thing
            // TODO: Switch to using the undo point
            const lastPoint = this.points[this.points.length - 1];
            const dx = point.x - lastPoint.x;
            const dy = point.y - lastPoint.y;
            const sqDist = dx * dx + dy * dy;
            if (sqDist > maxDrawDist * maxDrawDist) {
                this.points.push(point);
                this.pathEndIndex = this.points.length;
            }
        }
    }

    render() {
        this.clear();
        this.drawPoints(this.path);
    }

    drawPoints(path) {
        this.context.beginPath();
        this.context.strokeStyle = palette.blue;
        this.context.lineWidth = 2;
        for (let i = 0; i < path.length; i ++) {
            if (i == 0) {
                this.context.moveTo(path[i].x, path[i].y);
            }
            else {
                this.context.lineTo(path[i].x, path[i].y);
            }
        }
        // this.context.closePath();
        this.context.stroke();
    }
}
