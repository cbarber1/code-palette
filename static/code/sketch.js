var particles = [];

var xoff_ = 200;

var inc = .0004; // .0004

let looping = true;

// Setup function
function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch-holder');
  resetSketch();
}

function resetSketch() {
  particles = [];
  for (var i =0; i < 20; i++){
    particles.push(new Particle(mouseX, mouseY));
  }
}
// Adds new particle when mouse is clicked
function mousePressed() {
  if (mouseX <= width && mouseX >= 0
&& mouseY >= 0 && mouseY <= height) {
  particles.push(new Particle(mouseX, mouseY));
  }
}

// Draws particles using for loop
function draw() {
  var back_col = map(noise(xoff_), 0, 1, 0 , 200);
  background(255);
  xoff_ += inc;

 for (var i = 0; i < particles.length; i++) {
   particles[i].update();
   particles[i].show();
 }
}

// Class of particles, includes update and show functions
class Particle {
  constructor(x,y) {
  this.pos = createVector(x, y);
  this.ranCol = random(3);

  this.history = [];
  this.xoff = random(10000);
  this.yoff = random(20000);
  this.vel = p5.Vector.random2D();

  this.follow_mode = false;

}
  // Didn't use this function
  switch() {
  if (!this.follow_mode) {
    this.follow_mode = true;
  } else {
    this.follow_mode = false;
  }
  }

  // Didn't use this function
  applyForce(force) {
    this.acc.add(force);
  }

  // Updates the position of particle
  update() {
    this.vel = createVector(map(noise(this.xoff),0,1, 0, width), map(noise(this.yoff), 0, 1, 0, height));
    this.pos.add(this.vel);

    this.pos.x = map(noise(this.xoff),0,1, 0, width);
    this.pos.y = map(noise(this.yoff), 0, 1, 0, height);
    this.xoff += .007;
    this.yoff += .007;

    var v = createVector(this.pos.x, this.pos.y);

    this.history.push(v);

    if (this.history.length > 25) { //35 normally
      this.history.splice(0, 1);
    }


  }

  show() {
    // makes nice circle when they first show up
    stroke(0);
    fill(0, 100);
    ellipse(this.pos.x, this.pos.y, 24, 24);

    for (var i = 0; i < this.history.length;i++) {
      this.col = 80;
      this.col1 = 80;
      this.col2 = 80;
      noStroke();
      colorMode(RGB);
      if (this.ranCol < 1) {
        fill(this.col, 0, 0, 150);
      } else if (1 < this.ranCol < 2) {
        fill(0, this.col2, this.col1, 150);
      } else {
        fill(0, 100);
      }
      var pos_his = this.history[i];
      ellipse(pos_his.x, pos_his.y, i+2, i+2);
    }
  }
}
