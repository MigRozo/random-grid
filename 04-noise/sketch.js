const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
  cols: 10,
  rows: 10,
  rectScaleMin: 1,
  rectScaleMax: 30,
  frequency: 0.001,
  amplitude: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
  bgColor: '#000000',
  lineColor: '#FFFFFF',
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.bgColor;
    context.strokeStyle = params.lineColor;
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const cellsLength = cols * rows;

    const gridWidth = width * 0.8;
    const gridHeight = height * 0.8;
    const cellWidth = gridWidth / cols;
    const cellHeight = gridHeight / rows;
    const marginX = (width - gridWidth) * 0.5;
    const marginY = (width - gridHeight) * 0.5;

    for ( let i = 0; i < cellsLength; i++ ) {
      const col = i % cols;
      const row = Math.floor( i / cols );

      const pathX = col * cellWidth;
      const pathY = row * cellHeight;
      const pathWidth = cellWidth * 0.8;
      // const pathHeight = cellHeight * 0.8;

      const currentFrame = params.animate ? frame : params.frame;

      // const noise = random.noise2D(rectX + frame * 10, rectY, params.frequency);
      const noise = random.noise3D(pathX, pathY, currentFrame * 10, params.frequency);
      const rectAngle = noise * Math.PI * params.amplitude;
      // const noiseScale = (noise * 0.5 + 0.5) * 30;
      const rectScale = math.mapRange(noise, -1, 1, params.rectScaleMin, params.rectScaleMax);

      context.save();
      context.translate( pathX, pathY );
      context.translate( marginX, marginY );
      context.translate( cellWidth * 0.5, cellHeight * 0.5 );
      context.rotate( rectAngle );

      // context.lineWidth = 4;
      context.lineWidth = rectScale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(pathWidth * -0.5, 0);
      context.lineTo(pathWidth * 0.5, 0);
      context.stroke();

      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid' });
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'rectScaleMin', { min: 1, max: 100 });
  folder.addInput(params, 'rectScaleMax', { min: 1, max: 100 });
  folder.addSeparator();
  folder.addInput(params, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square' } });
  folder.addSeparator();
  folder.addInput(params, 'bgColor');
  folder.addInput(params, 'lineColor');

  folder = pane.addFolder({ title: 'Noise' });
  folder.addInput(params, 'frequency', { min: -0.01, max: 0.01 });
  folder.addInput(params, 'amplitude', { min: 0, max: 1 });

  folder = pane.addFolder({ title: 'Animation' });
  folder.addInput(params, 'frame', { min: 0, max: 999, step: 1 });
  folder.addInput(params, 'animate');
};

createPane();
canvasSketch(sketch, settings);
