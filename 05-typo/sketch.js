const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager;

let char = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

const charCanvas = document.createElement('canvas');
const charContext = charCanvas.getContext('2d');

const getGlyph = (v) => {
  if ( v < 50 ) return '';
  if ( v < 100 ) return '.';
  if ( v < 150 ) return '-';
  // if ( v < 200 ) return '+';
  if ( v < 200 ) return Math.floor(random.range(1, 9));

  // return char;

  const glyphs = '_= /'.split('');
  return random.pick(glyphs);
};

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const cellsLength = cols * rows;

  charCanvas.width = cols;
  charCanvas.height = rows;

  return ({ context, width, height }) => {
    charContext.fillStyle = 'black';
    charContext.strokeStyle = 'white';
    charContext.fillRect(0, 0, cols, rows);

    // fontSize = cols * 1.2;
    fontSize = cols;

    charContext.fillStyle = 'white';
    charContext.font = `${fontSize}px ${fontFamily}`;
    charContext.textBaseline = 'top';

    const metrics = charContext.measureText(char);
    const metricsX = metrics.actualBoundingBoxLeft * -1;
    const metricsY = metrics.actualBoundingBoxAscent * -1;
    const metricsWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const metricsHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const charX = (cols - metricsWidth) * 0.5 - metricsX;
    const charY = (rows - metricsHeight) * 0.5 - metricsY;

    charContext.save();
    charContext.translate(charX, charY);

    // charContext.beginPath();
    // charContext.rect(metricsX, metricsY, metricsWidth, metricsHeight);
    // charContext.stroke();

    charContext.fillText( char, 0, 0 );
    charContext.restore();

    const charData = charContext.getImageData(0, 0, cols, rows).data;

    context.textBaseline = 'middle';
    context.textAlign = 'center';

    // context.drawImage(charCanvas, 0, 0);

    // COVER SMALL CHAR
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < cellsLength; i++) {
      const currentCol = i % cols;
      const currentRow = Math.floor(i / cols);

      const cellX = currentCol * cell;
      const cellY = currentRow * cell;

      const cellR = charData[i * 4 + 0];
      const cellG = charData[i * 4 + 1];
      const cellB = charData[i * 4 + 2];
      // const cellA = charData[i * 4 + 3];

      const glyph = getGlyph(cellR);

      context.font = `${cell * 2}px ${fontFamily}`;
      if ( Math.random() < 0.1 ) context.font = `${cell * 6}px ${fontFamily}`;
      // context.fillStyle = `rgb(${cellR},${cellG},${cellB})`;
      context.fillStyle = `white`;

      context.save();
      context.translate(cellX, cellY);
      context.translate(cell * 0.5, cell * 0.5);

      // SQUARES
      // context.fillRect(0, 0, cell, cell);

      // CIRCLES
      // context.beginPath();
      // context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      // context.fill();

      // context.fillText(char, 0, 0);
      context.fillText(glyph, 0, 0);

      context.restore();
    }
  };
};

const onKeyUp = (e) => {
  char = e.key.toUpperCase();
  manager.render();
};
document.addEventListener('keyup', onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};
start();
