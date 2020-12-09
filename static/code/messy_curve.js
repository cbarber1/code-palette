// This algorithm was not done by me, however I did modify it for my own use and to make it look more clean
// Here's the original where I got it from
// https://www.openprocessing.org/sketch/486307



var imgs = [];
var imgIndex = -1;
var img;
var paint;
var subStep = 800; //800
var z = 0;
var isStop = false;
var count = 0;
var imageSave = 0;
let gifLength = 210;
let paintCount = 0;
var canvas;

// Preloads image 
function preload() {
  imgs[0] = loadImage("/static/art/code_palette.png");
}

// Setup function 
function setup() {
	if (windowWidth < 500) {
  	var c = createCanvas(windowWidth, windowWidth);
  	c.parent('sketch-holder');
	}
	else {
  	canvas = createCanvas(800, 200);
    canvas.parent('sketch-holder');
	}

  img = createImage(width, height);
  nextImage();
  paint = new Paint(createVector(width/2, height/2));
  background(255, 255, 255);
  colorMode(RGB, 255, 255, 255, 255);
  frameRate(10);
}

// Drawing the paint class
function draw() {
  //console.log(frameRate());
  if (!isStop) {
  	for (var i = 0 ; i < subStep ; i++) {
      paintCount++;
      paint.update();
      paint.show();
      z+= 0.01;
    }
  }
	count++;
	if (count > width-600) {
    imageSave++;
    if (imageSave == 1){
    //saveCanvas('myCanvas', 'png');
    }
		isStop = true;
	}
	//background(255);
	//image(img, 0, 0, width, height);
}

function fget(i, j) {
  var index = j * img.width + i;
  index *= 4;
  return color(img.pixels[index], img.pixels[index+1], img.pixels[index+2], img.pixels[index+3]);
}

function fset(i, j, c) {
  var index = j * img.width + i;
  index *= 4;
  img.pixels[index] = red(c);
  img.pixels[index+1] = green(c);
  img.pixels[index+2] = blue(c);
  img.pixels[index+3] = alpha(c);
}

function keyPressed() {
  console.log(key);
  if (key === 's' || key === 'S') {
    isStop = !isStop;
  }
}
// function mouseClicked() {
//   nextImage();
// 	isStop = false;
// 	count = 0;
// }
// function touchStarted() {
//   nextImage();
// 	isStop = false;
// 	count = 0;
// }

function nextImage() {
	if (!img) return;
  imgIndex = (++imgIndex) % imgs.length;
  var targetImg = imgs[imgIndex];
  img.copy(targetImg, 0, 0, targetImg.width, targetImg.height, 0, 0, img.width, img.height);
  //img.resize(width, height);
  img.loadPixels();
  clear();
}
