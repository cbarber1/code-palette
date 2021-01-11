let l = 200;

let s = 20;

let dots = 100;

let looping = true;

function setup() {
  var c = createCanvas(1200, 1000);
  c.parent("sketch-holder");
  resetSketch();
}

function resetSketch() {
  resetMatrix();
  background(255);
  colorMode(HSB);
  rectMode(CENTER);
  fill(180, 60, 70);
  push();
  noStroke();
  translate(width/2, height/2);
  rotate(PI/4);
  rect(0, 0, 700);
  pop();
  translate(width/2, height);
  stroke(20, 28);
  strokeWeight(30);
  line(0, 0, 0, -400);
  translate(0, -400);
  tree(s, l, 1, 10);
}

// recursively drawing the tree
function tree(s, len, lvl, max) {
  if (lvl >= max) {
    // leaves
    fill(random(20, 25), 150, 80, .5);
    noStroke();
    ellipse(0, 0, random(8, 12));
    return;
  }
  strokeWeight(s);
  stroke(20, map(lvl, 1, max,100, 20));

  // branches
  for (let i = 0; i < 2; i++)
  {
    if (lvl > max - 4)
    {
        if (random(1) > 0.5) {
          push();
          rotate(random(PI/3, PI/6));
          line(0, 0, 0, -len);
          translate(0, -len);
          tree(s*.66, len*randomGaussian(.66, 0.05), lvl + 1, max)
          pop();
        }
    } else {
        push();
        rotate(random(PI/3, PI/6));
        line(0, 0, 0, -len);
        translate(0, -len);
        tree(s*.66, len*randomGaussian(.66, 0.05), lvl + 1, max)
        pop();
      }
    }
    for (let i = 0; i < 2; i++)
    {
      if (lvl > max - 4)
      {
          if (random(1) > 0.5) {
            push();
            rotate(random(-PI/3, -PI/6));
            line(0, 0, 0, -len);
            translate(0, -len);
            tree(s*.66, len*randomGaussian(.66, 0.05), lvl + 1, max)
            pop();
          }
      } else {
        push();
        rotate(random(-PI/3, -PI/6));
        line(0, 0, 0, -len);
        translate(0, -len);
        tree(s*.66, len*randomGaussian(.66, 0.05), lvl + 1, max)
        pop();
      }
    }
}
