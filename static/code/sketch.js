var particles = [];

var xoff_ = 200;

var inc = .0004; // .0004

let looping = true;

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch-holder');
  for (var i =0; i < 20; i++){
    particles.push(new Particle(mouseX, mouseY));
  }
}

function mousePressed() {
  if (mouseX <= width && mouseX >= 0
&& mouseY >= 0 && mouseY <= height) {
  particles.push(new Particle(mouseX, mouseY));
  }
}
function draw() {
  var back_col = map(noise(xoff_), 0, 1, 0 , 200);
  background(255);
  xoff_ += inc;

 for (var i = 0; i < particles.length; i++) {
  //let gravity = createVector(0, 0.5);
  //particles[i].applyForce(gravity);
   particles[i].update();
   particles[i].show();
 }
}

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

  switch() {
  if (!this.follow_mode) {
    this.follow_mode = true;
  } else {
    this.follow_mode = false;
  }
  }
  applyForce(force) {
    this.acc.add(force);
  }
  update() {
    //this.mouse = createVector(mouseX, mouseY);
    this.vel = createVector(map(noise(this.xoff),0,1, 0, width), map(noise(this.yoff), 0, 1, 0, height));
    this.pos.add(this.vel);
    // if (this.follow_mode) {
    //   this.acc = p5.Vector.sub(this.mouse, this.pos);
    //   this.acc.setMag(5);
    // }
    this.pos.x = map(noise(this.xoff),0,1, 0, width);
    this.pos.y = map(noise(this.yoff), 0, 1, 0, height);
    this.xoff += .007;
    this.yoff += .007;
    // if (this.follow_mode) {
    //   this.vel.add(this.acc);
    //   this.pos.add(this.vel);
    // }

    var v = createVector(this.pos.x, this.pos.y);

    this.history.push(v);

    if (this.history.length > 25) { //35 normally
      this.history.splice(0, 1);
    }


  }

  show() {
    stroke(0);
   //noStroke();
    fill(0, 100);
    ellipse(this.pos.x, this.pos.y, 24, 24);

    for (var i = 0; i < this.history.length;i++) {
      //this.col = map(noise(this.xoff),0,1, 0, 150);
      //this.col1 = map(noise(this.xoff),0,1, 0, 150);
      //this.col2 = map(noise(this.xoff),0,1, 0, 150);
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