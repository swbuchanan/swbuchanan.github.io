const screenwidth = 800;
const screenheight = 600;
const graphScale = 60;
const originX = screenwidth / 2;
const originY = screenheight / 2;

// The graph coordinates are the intuitive ones, where (0,0) is in the center of the screen, and the values of x and y range from about -10 to 10

function graphToScreenCoords (coords) {
  const x = coords[0];
  const y = coords[1];
  return[(x*graphScale + originX), (-y*graphScale + originY)];
}

function screenToGraphCoords (coords) {
  const x = coords[0];
  const y = coords[1];
  return[(x - originX)/graphScale, -(y - originY)/graphScale];
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get screenCoords() {
    return [this.x,this.y]
  }

  set screenCoords(newVals) {
    this.x = newVals[0];
    this.y = newVals[1];
  }

  get graphCoords() {
    return screenToGraphCoords(this.screenCoords);
  }
}

class Example extends Phaser.Scene {
 
  create ()
  {
    this.angle = 0;

    this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa } });

    // Create a point that will move around the parametrized graph
    this.movingPoint = 0;
    this.dot = this.add.graphics({ fillStyle: { color: 0x00ff00 } });

    [this.minX, this.maxX] = screenToGraphCoords(0,screenwidth);

    this.stepSize = 1; // Step size for plotting points
    this.functionExpression = x => 1/x; // Example function: sine function

    this.originX = screenwidth/2;
    this.originY = screenheight/2;

    this.point = new Phaser.Math.Vector2(250, 0);
    this.point2 = new Phaser.Math.Vector2(250, 0);

    this.text = this.add.text(30, 30, '');

    this.input.on('pointermove', (pointer) => {

        this.point2.copy(pointer);

        this.point2.x -= this.originX;
        this.point2.y -= this.originY;

    });
  }


  drawParametricFunction (graphics, functionExpression, paramStart, paramEnd, numSteps) {
    this.graphics.lineStyle(4,0xaa0000);
    // example functionExpression is t => [t, t**2]
    this.graphics.moveTo(functionExpression(paramStart)[0], functionExpression(paramStart)[1]);
    this.graphics.beginPath();
    for (let t = paramStart; t <= paramEnd; t += (paramEnd - paramStart)/numSteps) {
//      graphics.lineTo(functionExpression(t)[0]*20 + this.originX, (-functionExpression(t)[1]/20) + this.originY);
      this.graphics.lineTo(graphToScreenCoords(functionExpression(t))[0], graphToScreenCoords(functionExpression(t))[1]);
//      this.graphics.lineBetween(originX, originY, graphToScreenCoords(functionExpression(t))[0], graphToScreenCoords(functionExpression(t))[1]);
//      console.log(graphToScreenCoords(functionExpression(t))[1]);
    }
  }


    update() {
      this.graphics.clear();

      const [graphX, graphY] = screenToGraphCoords([this.point2.x, this.point2.y]);
      this.functionExpression = x => (graphX*graphY)/x

      this.graphics.lineStyle(2,0xbbbbbb);

      // Draw x-axis
      this.graphics.lineBetween(0,screenheight/2,screenwidth,screenheight/2);

      // Draw y-axis
      this.graphics.lineBetween(screenwidth/2,0,screenwidth/2,screenheight);

      this.graphics.lineBetween(originX, originY, this.point2.x + originX, this.point2.y + originY);


//      const parametricFunction = t => [t,t**2]
      const func1 = t => 2*Math.cos(t) + Math.cos(t)*(.2*Math.cos(4*t));
      const func2 = t => Math.sin(t) + Math.sin(t)*(.2*Math.sin(3*t) - .2*Math.cos(5*t));

      const func1prime = t => Math.sin(t)*(-.2*Math.cos(4*t) - 2) - .8*Math.sin(4*t)*Math.cos(t);
      const func2prime = t => Math.cos(t)*(.2*Math.sin(3*t) - .2*Math.cos(5*t) + 1) + Math.sin(t)*(Math.sin(5*t) + .6*Math.cos(3*t));

      const parametricFunction = t => [func1(t), func2(t)];
      this.drawParametricFunction(this.graphics, parametricFunction, 0, 2*Math.PI, 80);
      this.graphics.strokePath();

      // animate the normal vector
      this.movingPoint += .005;
      const [movingPointX, movingPointY] = graphToScreenCoords([func1(this.movingPoint), func2(this.movingPoint)]);

      var [normVecX, normVecY] = [func2prime(this.movingPoint), -func1prime(this.movingPoint)];
      normVecX = normVecX/Math.sqrt(normVecX**2 + normVecY**2);
      normVecY = normVecY/Math.sqrt(normVecX**2 + normVecY**2);
      [normVecX,normVecY] = graphToScreenCoords([func1(this.movingPoint)+ normVecX, func2(this.movingPoint) + normVecY]);
      this.graphics.lineBetween(movingPointX, movingPointY, normVecX, normVecY);

//      this.graphics.strokePath();



        this.text.setText([
            'Dot product: ' + 10,
        ]);
    }
}

const config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'game-container',
    scene: Example
};

const game = new Phaser.Game(config);
