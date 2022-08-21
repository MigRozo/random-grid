const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

/* const animate = () => {
  console.log('Animating...');
  requestAnimationFrame(animate);
};
animate(); */

const sketch = ({ width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push( new Agent(x, y) );
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const currentAgent = agents[i];
      
      for (let j = i + 1; j < agents.length; j++) {
        const otherAgent = agents[j];

        const distance = currentAgent.pos.getDistance( otherAgent.pos );

        if ( distance > 200 ) continue;

        context.lineWidth = math.mapRange(distance, 0, 200, 12, 1);

        context.beginPath();
        context.moveTo( currentAgent.pos.x, currentAgent.pos.y );
        context.lineTo( otherAgent.pos.x, otherAgent.pos.y );
        context.stroke();
      }
    }
    
    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      agent.bounce( width, height );
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor ( x, y ) {
    this.x = x;
    this.y = y;
  }

  getDistance (v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt( dx * dx + dy * dy );
  }
}
class Agent {
  constructor ( x, y ) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12);
  }

  bounce ( width, height ) {
    if ( this.pos.x <= 0 || this.pos.x >= width ) this.vel.x *= -1;
    if ( this.pos.y <= 0 || this.pos.y >= height ) this.vel.y *= -1;
  }

  update () {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw (context) {
    context.save();
    context.translate( this.pos.x, this.pos.y );

    context.lineWidth = 4;
    context.beginPath();
    context.arc( 0, 0, this.radius, 0, Math.PI * 2 );
    context.fill();
    context.stroke ();

    context.restore();
  }
}