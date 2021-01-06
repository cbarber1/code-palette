let n = 2; //2
let d = 71; //71

let looping = true;

// Setup function
function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch-holder');
  angleMode(DEGREES);
  colorMode(HSB);
  resetSketch();
  //console.log(d);
  //console.log(n);
}

function resetSketch() {
  randomSeed(49.25067844587703);
  d = random(100);
  n = random(20);
}

// Drawing using Maurer Rose equations
function draw() {
  background(255);
  translate(width/2, height/2);
  color = 0;
  stroke(color);

  noFill();
  for (let j = 0; j < 361; j+=.2){ //.2 looks sick // .12 also looks good
    beginShape()
    for (let i = j; i < j+2; i++) {
      let k = i * d;
      let r = 200 * sin(n*k);
      let x = r * cos(k);
      let y = r * sin(k);
      //randomSeed(i+1);
      //console.log(randColor);
      //stroke(20, random(20, 100), random(50, 100));
      //strokeWeight(4);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  n += .0000055;//.00002  n += .00012;
  //d += .00018; looks sick //.000015 with pattern seed
  d += .000025;//.00008 is insane
  // .000045 with pattern seed
  color += 1;
}
