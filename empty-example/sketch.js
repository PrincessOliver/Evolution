
var img;
var img2;
var img3;
var img4;
var img5;
var img6;
var img7;
var carnivores = [];
var vehicles = [];
var food = [];
var poison = [];

var debug;

//River variables:
var riverWidth = 150
var riverL = 400;
var riverR = riverL + riverWidth;
var riverM = riverL + (riverWidth/2);
var mountWidth =150;
var mountL =800;
var mountY=100;
var mountH =150;
var mountR= mountL + mountWidth;
var mountM= mountL + (mountWidth/2);

function setup() {
  createCanvas(1200, 550);
  frameRate(60);
  img=loadImage("Png til skole/Stem3.png.png");
  img2=loadImage("Png til skole/Carnivore2.png.png");
  img3=loadImage("Png til skole/perceptionbug.png.png");
  img4=loadImage("Png til skole/poisonperceptionbug.png.png");
  img5=loadImage("Png til skole/ultimateperceptionbug.png.png");
  img6=loadImage("Png til skole/Bigboi.png.png");
  img7=loadImage("Png til skole/WaterBug.png.png");


  for (var i = 0; i < 10; i++) {
    //Spawn Vehicles and positioning of them.
    var x = random(width);
    var y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }

/*
  for (var i = 0; i < 10; i++) {
    //Spawn Vehicles and positioning of them.
    var x = random(width);
    var y = random(height);
    carnivores[i] = new Carnivore(x, y);
  }
  */

  for (var i = 0; i < 50; i++) {
    //Spawn Food
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  for (var i = 0; i < 20; i++) {
    //Spawn poison
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }

  debug = createCheckbox(); //
}

function mouseDragged() { //Testing vehicles by clicking mouse
  vehicles.push(new Vehicle(mouseX, mouseY));
}

/*function mouseDragged() {
  //Testing vehicles by clicking mouse
  carnivores.push(new Carnivore(mouseX, mouseY));
}*/

function draw() {
  background(51);
  //image(img,0,0);
  fill(3, 78, 252);
  rect(riverL, 0, riverWidth, height);   //River location +

  // fill(168, 111, 50);
  // rect(mountL, 100 ,mountWidth, mountH);

  for (i = 0; i < vehicles.length; i++){
      textSize(32);
      text("Creatures Alive: "+vehicles.length, 10, 30);
      fill(252, 3, 3);
    }

  for (i = 0; i < carnivores.length; i++){
      textSize(32);
      text("Carnivores Alive: "+carnivores.length, 10, 60);
      fill(252, 3, 3);
    }

  if (random(1) < 0.5) {
    //Spawning food randomly at different intevals
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }


  if (random(1) < 0.01) {
    //Spawning poison randomly at different intevals
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }

  for (var i = 0; i < food.length; i++) {
    //Food Visuals
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4);
  }

  for (var i = 0; i < poison.length; i++) {
    //Poison Visuals
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 4, 4);
  }

  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].boundaries();
    vehicles[i].behaviors(food, poison);
    vehicles[i].update(); //Updates position of Vehicle
    vehicles[i].display(); // Visuals for Vehicle

    var newVehicle = vehicles[i].clone();
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }

    if (vehicles[i].dead()) {
      var x = vehicles[i].position.x;
      var y = vehicles[i].position.y;
      food.push(createVector(x, y));
      vehicles.splice(i, 1);
    }
  }

  for (var i = carnivores.length - 1; i >= 0; i--) {
    carnivores[i].boundaries();
    carnivores[i].behaviors(food, poison);
    carnivores[i].update(); //Updates position of Vehicle
    carnivores[i].display(); // Visuals for Vehicle


  }
}
