const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

// const degToRad = (degrees) => degrees / 180 * Math.PI;
// const randomRange = (min, max) => Math.random() * (max - min) + min;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';
    context.strokeStyle = 'white';

    const cx = width * 0.5;
    const cy = height * 0.5;

    const lineWidth = width * 0.01;
    const lineHeight = height * 0.1;
    let lineX, lineY;

    const linesLength = 12;
    const radius = width * 0.3;

    const slice = math.degToRad( 360 / linesLength );
    for ( let i = 0; i < linesLength; i++ ) {
      const currentAngle = slice * i;

      lineX = cx + radius * Math.sin(currentAngle);
      lineY = cy + radius * Math.cos(currentAngle);

      context.save();
      context.translate(lineX, lineY);
      context.rotate(-currentAngle);
      context.scale( random.range(0.1, 2), random.range(0.2, 0.5) );
      context.beginPath();
      context.rect(-lineWidth * 0.5, random.range(0, -lineHeight * 0.5), lineWidth, lineHeight);
      context.fill();
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-currentAngle);
      context.lineWidth = random.range(5, 20);
      context.beginPath();
      context.arc(0, 0, radius * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
