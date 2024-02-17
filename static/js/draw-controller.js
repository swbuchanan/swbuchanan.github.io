import CanvasController from './canvas-controller.js';
import { palette } from '../color.js';

const maxDrawDist = 3;

export default class DrawController extends CanvasController {

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

        this.canvas.addEventListener('mousedown', () => this.startDrawing());
        this.canvas.addEventListener('touchstart', () => this.startDrawing());

        document.addEventListener('mouseup', () => this.stopDrawing());
        document.addEventListener('touchend', () => this.stopDrawing());

        // Prevent scrolling while we're drawing here
        this.canvas.addEventListener('touchmove', (evt) => evt.preventDefault(), {passive: false});

        document.addEventListener('keydown', (evt) => this.checkKeys(evt));
    }

    get path() {
        return this.points.slice(0, this.pathEndIndex);
    }

    setPoints(points) {
        this.points = points;
        this.stopDrawing();
    }

    /**
     * @param {KeyboardEvent} evt
     */
    checkKeys(evt) {
        switch (evt.key.toLowerCase()) {
            case 'z':
                this.undo();
                break;
            case 'y':
                this.redo();
                break;
            case 'p':
                // "print"
                console.log(this.path);
                break;
        }
    }

    startDrawing() {
        this.drawing = true;

        // clear the redo cache
        this.points = this.path;
        this.undoIndexes = this.undoIndexes.slice(0, this.curUndoIndex + 1)

        this.onDrawingStart.forEach(fn => fn());
    }

    stopDrawing() {
        if (!this.drawing) {
            return;
        }
        this.drawing = false;

        this.curUndoIndex ++;
        this.undoIndexes.push(this.points.length);
        this.pathEndIndex = this.undoIndexes[this.curUndoIndex];

        this.onDrawingEnd.forEach(fn => fn());
    }

    undo() {
        let newIndex = this.curUndoIndex - 1;
        if (newIndex < 0) {
            newIndex = 0;
        }
        if (newIndex != this.curUndoIndex) {
            this.curUndoIndex = newIndex;
            this.pathEndIndex = this.undoIndexes[this.curUndoIndex];

            this.onDrawingEnd.forEach(fn => fn());
        }
    }

    redo() {
        let newIndex = this.curUndoIndex + 1;
        if (newIndex > this.undoIndexes.length - 1) {
            newIndex = this.undoIndexes.length - 1;
        }
        if (newIndex != this.curUndoIndex) {
            this.curUndoIndex = newIndex;
            this.pathEndIndex = this.undoIndexes[this.curUndoIndex];

            this.onDrawingEnd.forEach(fn => fn());
        }
   }

    update(dt, mousePosition) {
        if (!mousePosition || !this.drawing) {
            return;
        }

        const canvasPosition = this.canvas.getBoundingClientRect();
        // we have to account for the border here too
        const actualWidth = (canvasPosition.right - canvasPosition.left) - 2;
        // 500 being the 'default' width
        const scale = 500 / actualWidth;
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
        this.context.strokeStyle = palette.pink;
        this.context.lineWidth = 2;
        for (let i = 0; i < path.length; i ++) {
            if (i == 0) {
                this.context.moveTo(path[i].x, path[i].y);
            }
            else {
                this.context.lineTo(path[i].x, path[i].y);
            }
        }
        this.context.closePath();
        this.context.stroke();
    }
}
