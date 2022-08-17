const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.01;
    context.strokeStyle = 'white';

    const cellWidth = width * 0.1;
    const cellHeight = height * 0.1;
    const cellsGap = width * 0.03;
    const initialX = width * 0.17;
    const initialY = height * 0.17;
    const cellOffset = width * 0.02;

    let cellX, cellY;

    for ( let i = 0; i < 5; i++ ) {
      for ( let j = 0; j < 5; j++ ) {

        cellX = initialX + ( cellWidth + cellsGap ) * i;
        cellY = initialY + ( cellHeight + cellsGap ) * j;

        context.beginPath();
        context.rect( cellX, cellY, cellWidth, cellHeight );
        context.stroke();

        if ( Math.random() > 0.5 ) {
          context.beginPath();
          // context.rect( cellX + ( cellOffset * 0.5 ), cellY + ( cellOffset * 0.5 ), cellWidth - cellOffset, cellHeight - cellOffset );
          context.rect( cellX + cellOffset, cellY + cellOffset, cellWidth - (cellOffset * 2), cellHeight - (cellOffset * 2) );
          context.stroke();
        }

      }
    }

  };
};

canvasSketch(sketch, settings);
