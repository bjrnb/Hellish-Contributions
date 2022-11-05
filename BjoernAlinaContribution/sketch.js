let topColor;
let bottomColor;
let sun;
let welcomeTextSign;
let towerOfLove;
let mountainRanges = [];
let maxMountainRanges = 6;
let mountainClouds = [];

let screenX = 1920;
let screenY = 1080;

let signText = "Welcome to H4"
let x = 666;

function preload() {
  //myFont = loadFont('DotGothic16-Regular.ttf');
}

function setup() {
  createCanvas(screenX, screenY);
  colorMode(HSB, 255);

  topColor = getBGColor();
  bottomColor = color(hue(topColor), saturation(topColor) * 0.9, brightness(topColor) * 1.5);
  sun = new Sun(topColor);
  welcomeTextSign = new WelcomeText();
  towerOfLove = new Tower();

  for (let i = 0; i < maxMountainRanges; i++) {
    let mountainRange = new MountainRange(i, maxMountainRanges, topColor);
    mountainRanges.push(mountainRange);
  }

  smooth();
}

function draw() {
  drawBackground(topColor, bottomColor);
  sun.draw();
  welcomeTextSign.draw();

  for (let i = mountainRanges.length - 1; i >= 0; i--) {

    if (i in mountainClouds){
      mountainClouds[i].draw();
    }

    let mountainRange = mountainRanges[i];
    //print("draw mountainRange", mountainRange.height);
    mountainRange.draw();
  }
  towerOfLove.show(50,600,100,500);
  towerOfLove.show(239,700,100,500);
  towerOfLove.show(666,666,130,666);
  towerOfLove.show(1666,666,130,666);
}

function getBGColor() {
  colorMode(HSB, 255);
  let hue = 160;
  return color(hue, 115, 150);
}

function drawBackground(top, bottom) {
  let ctx = drawingContext;
  let grd = ctx.createLinearGradient(0, 0, 0, width);
  grd.addColorStop(0, top);
  grd.addColorStop(0.4, bottom);

  let oldFillStyle = ctx.fillStyle; // save old fillstyle to reset
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = oldFillStyle;
}

class Tower {
  constructor() {
    this.x = random(width);
    this.y = random(height);
  }

  show(posX, posY, sizeX, sizeY) {
    fill(35,23,12);
    rect(posX, posY, sizeX, sizeY);
  }
}


class WelcomeText
{ //文字の表示位置

  constructor() {
    this.textSize = 100;
    this.textFont = "DotGothic16";
    this.shadowColor = color(0, 255, 255);
    this.shadowBlur = 30;
  }
  draw() {
    let context = drawingContext;
    context.shadowColor = color(200, 255, 255);
    context.shadowBlur = 30;
    textSize(100);
    textFont("DotGothic16");
    strokeWeight(1);
    stroke(0, 255, 255);
    noFill();
    text(signText, x, 200);
  }
}

class Sun extends Shape {

  constructor(baseColor) {
    let size = 50 + width * 0.5;
    let xLoc = width * 0.5;
    let yLoc = size * 0.2;
    super(xLoc, yLoc, size, size);

    this.fillColor = color(hue(topColor), saturation(topColor) * 0.9,
      brightness(topColor) * 1.6);
  }

  draw() {
    noStroke();
    fill(this.fillColor);
    ellipse(this.x, this.y, this.width, this.height);
  }
}

class Cloud {

  constructor(mountainRange, baseColor){

    this.mountainRange =  mountainRange;

    this.fillColor = color(hue(bottomColor), 255 * 0.3, 255 * 0.9, 128);

    print("Making cloud for ", mountainRange.zIndex, " with height", this.mountainRange.height);

    this.smallWaveY = 5;
    this.angle1Multiplier = 0.08; // small wave

    this.largeWaveY = 15;
    this.angle2Multiplier = 0.02; // large wave
  }

  draw() {
    fill(this.fillColor);
    beginShape();
    vertex(0, height);
    for (let x = 0; x < width; x++) {
      let angle = x * this.angle1Multiplier;
      let y = map(abs(sin(angle)), 0, 1, 0, this.smallWaveY);

      let angle2 = x * this.angle2Multiplier;
      let y2 = map(sin(angle2), -1, 1, 0, this.largeWaveY);
      y += y2;

      let nx = map(x, 0, width, 0, 5);
      y += 50 * noise(nx);

      vertex(x, height - y);
    }
    vertex(width, height);
    endShape();
  }
}

class MountainRange extends Shape {
  constructor(zIndex, numMountains, baseColor) {
    let maxMountainHeight = (zIndex + 1) / numMountains * (height - height * 0.4);
    maxMountainHeight += min(pow(zIndex, 10), 100);

    super(0, height - maxMountainHeight, width, maxMountainHeight);

    let sat = map(zIndex, 0, numMountains, 0, saturation(topColor));
    let bright = map(zIndex, 0, numMountains, 0, saturation(topColor));
    this.fillColor = color(hue(topColor), sat, bright);

    this.jaggedness = 2

    this.startNoise = zIndex * width + 1;
    this.endNoise = this.startNoise + this.jaggedness;
    this.zIndex = zIndex;
  }

  draw() {
    fill(this.fillColor);

    beginShape();
    vertex(-20, height);
    for (var x = 1; x < width + 20; x++) {
      let nx = map(x, 0, width, this.startNoise, this.endNoise);
      let y = this.height * noise(nx);
      vertex(x, height - y);
    }
    vertex(width + 21, height);
    endShape();
  }
}