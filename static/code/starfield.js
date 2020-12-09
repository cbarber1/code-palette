let stars = [];
let speed;

let looping = true;

// Setup function 
function setup() {
  var canvas = createCanvas(500,500);
  canvas.parent("sketch-holder");
  for (let i = 0; i < 800; i++) {
    stars.push(new Star());
  }
}

// Draws the stars from the stars array
function draw() {
  speed = map(mouseX, -width*1.5, width, 0, 15);
  background(0);
  translate(width/2, height/2);
  for (let star of stars) {
    star.update();
    star.show();
  }
}

// Class star that has update and show functions
class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);

    this.pz = this.z;
  }

  // Updates position by changing z value
  update() {
    this.z = this.z - speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.pz = this.z;
    }
  }

  // Draws the star with a line to its previous position
  show() {
    fill(255);
    noStroke();
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);

    let r = map(this.z, 0, width, 16, 0);

    ellipse(sx, sy, r, r);

    let px = map(this.x / this.pz, 0, 1, 0, width);
    let py = map(this.y / this.pz, 0, 1, 0, height);

    this.pz = this.z;
    stroke(255);
    line(px, py, sx, sy);

  }
}