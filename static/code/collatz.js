let i = 1;
let loops;

let looping = true;
let gaussian = .01;

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent("sketch-holder");
  //beginRecord(PDF, "collatz.pdf");
  loops = random(800, 1200);
  background(0);
  frameRate(10);
}

function mousePressed() {
  gaussian += 5;
}

function draw() {
  let sequence = [];
  let n = i;
  do {
    sequence.push(n);
    n = collatz(n);
  } while (n != 1);
    sequence.push(1);
    sequence.reverse();


  //Visualize the reversed List
  let len = 10; // 10
  let angle = PI/randomGaussian(3, gaussian);; // PI/3
  resetMatrix(); // without it, it could be pretty cool
  translate(width/2, height/2);//width/2

  for (let j = 0; j < sequence.length; j++) {
    let value = sequence[j];

    if (value % 2 == 0) {
      rotate(angle);
    } else {
      rotate(-angle);
    }
    stroke(random(200,250), random(100, 255), random(100, 150), 50); // 50 alpha normally

    line(0, 0, 0, -len);
    translate(0, -len);

  }
  i += random(10);
  if (i > loops) {
    i = 1;
    //noLoop();
    background(0);
    gaussian = .01;
  }
}

function collatz(n) {
  if (n % 2 == 0) {
    return n / 2;
  } else {
    return (n * 3 + 1)/2;
  }
}

