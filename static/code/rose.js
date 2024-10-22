let n; //2
let d; //71

let looping = true;

// Setup function
function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch-holder');
  angleMode(DEGREES);
  //noLoop();
  resetSketch();
}

function resetSketch() {
  n = 2;
  d = 71;
}

// Drawing with Maurer Rose equation
function draw() {
  background(255);
  translate(width/2, height/2);
  color = 0;
  stroke(color);

  noFill();
  beginShape()
  for (let i = 0; i < 361; i++) {
    let k = i * d;
    let r = 200 * sin(n*k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }
  endShape();
  n += .000025;//.00002  n += .00012;//d += .00018; looks sick
  d += .000085;//.00008 is insane
  color += 1;


}
