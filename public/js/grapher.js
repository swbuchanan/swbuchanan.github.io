
class TwoVector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    difference(point){
        return new TwoVector (this.x - point.x, this.y - point.y);
    }

    sum(point){
        return new TwoVector(this.x + point.x, this.y + point.y);
    }
}

class Curve {
    constructor() {
        this.points = new Array();
        this.isClosed = false;
        this.anim = 0;
    }

    get length(){
        return this.points.length;
    }

    addPoint(point) {
        this.points.push(point);
    }

    closeCurve() {
        this.isClosed = true;
    }

    draw (context, amt=this.points.length) {
        if (amt > this.points.length) {
            amt = this.points.length;
        }
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < amt; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }
        if (this.isClosed && amt === this.points.length) {
            context.lineTo(this.points[0].x, this.points[0].y);
        }
        context.stroke();
    }

    normalVector(idx){
        // find the normal vector of the point with given index
        givenPoint = this.points[idx];
        if (idx === 0) {
            nextPoint = this.points[idx+1];
            if (this.isClosed()) {
                prevPoint = this.points[this.length - 1];
            } else {
                console.log("something bad happened");
                return null;
            }
        } else if (idx === this.points.length - 1) {
            prevPoint = this.points[idx-1];
            if (this.isClosed()) {
                nextPoint = this.points[0];
            } else {
                console.log("something bad happened");
                return null;
            }
        } else {
            prevPoint = this.points[idx-1];
            nextPoint = this.points[idx+1];
        }
        prevVector = prevPoint.difference(givenPoint);
        nextVector = nextPoint.difference(givenPoint);
    }
}

class Plane {
    constructor(canvasID) {
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');

        this.canvas.style.width = '400px';
        // this.context.imageSmoothingEnabled = true;
        this.animationFrameID = null;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.drawAxes();
        this.curves = new Array;
        this.graphScale = 90;
    }

    drawAxes() {
        const {canvas, context} = this;
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(0, canvas.height/2);
        context.lineTo(canvas.width, canvas.height/2);
        context.moveTo(canvas.width/2, 0);
        context.lineTo(canvas.width/2, canvas.height);
        context.stroke();
    }

    createGraph(func, xStart, xEnd, numPoints) {
        this.createParametricCurve(t => [t,func(t)], xStart, xEnd, numPoints);
    }

    createParametricCurve(func, paramStart, paramEnd, numPoints) {
        const curve = new Curve();
        const interval = paramEnd - paramStart;
        const dt = interval/numPoints;
        for (let t = paramStart; t <= interval; t += dt) {
            const value = func(t);
            const xVal = this.graphScale*(value[0]) + this.width/2;
            const yVal = this.graphScale*(-value[1]) + this.height/2;
            const nextPoint = new TwoVector(xVal, yVal);
            curve.addPoint(nextPoint);
        }
        console.log(curve);
        this.curves.push(curve);
    }

    animate() {

        for (const curve of this.curves) {
            curve.draw(this.context);
            // curve.anim ++;
            // if (curve.anim > curve.length) {
            //     this.context.clearRect(0,0,this.width, this.height);
            //     this.drawAxes();
            //     curve.anim = 0;
            // }
        }
        // console.log(this.curves[0]);

        requestAnimationFrame(this.animate.bind(this));
    }
    


}

const graph = new Plane('graphCanvas');
graph.createParametricCurve(t => [Math.cos(t), 2*Math.sin(t)], 0, 2*Math.PI, 2000);
graph.animate();