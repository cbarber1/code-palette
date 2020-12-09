let w = 500;
let h = 500;

let colors;
let random_colors;

let variation = 10; //50

let radius = 350;

let growing = false;
let looping = true;

// setup canvas and colors
function setup() {
  var canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');
  colorMode(RGB);
  //noLoop();
  colors = [[color(188, 216, 193), color(214, 219, 178), color(227, 217, 133), color(229, 122, 68)],
[color(219, 177, 188), color(211, 196, 227), color(143, 149, 211), color(137, 218, 255)], [color(191, 107, 99), color(217, 163, 132), color(91, 158, 166), color(169, 212, 217)]];
  random_colors = int(random(3));
}

// creates the deformed circles
function deformed_circle(x, y, r, random_colors) {
  push();
  translate(x, y);

  let points = [];
  for (let i = 0; i < TWO_PI; i += .15) {
    let p = createVector(r/2*sin(i), r/2*cos(i));
    append(points, p);
}

  // Create deformed_circle
  let final = [];
  for (p in points) {
    let x_change = points[p].x / variation; // 55 normally
    let y_change = points[p].y / variation;

    let change = random(-3, 3);
    let new_p = createVector(points[p].x + x_change * change, points[p].y + y_change * change);
    append(final, new_p);
  }

  // Create outline and shape
  let rand = int(random(4));
  fill(colors[random_colors][rand]);
  strokeWeight(4);
  beginShape();
  for (p in final) {
    curveVertex(final[p].x, final[p].y);
  }
  curveVertex(final[0].x, final[0].y);
  curveVertex(final[1].x, final[1].y);
  curveVertex(final[2].x, final[2].y);
  endShape();

  pop();
}

// draws them with decreasing radius values
function draw() {
  random_colors = int(random(3))
  background(255);
  current_size = radius;
  while(current_size >= 0)
  {
    deformed_circle(w/2, h/2, current_size, random_colors);
    current_size -= 20; //10 looks sick
  }

  frameRate(2);

  if (radius <= 1) {
    growing = true;
  }
  else if (radius >= 350) {
    growing = false;
  }
  if (growing){
    radius +=30;
    frameRate(10);
  } else {
    radius -=15;
    frameRate(2);
  }
}
