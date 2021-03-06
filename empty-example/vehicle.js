var mr = 0.1;
var speedBugCounter = 0;
function Vehicle(x, y, dna) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 4;
  this.maxspeed = 1.5;
  this.maxforce = 0.8;
  this.size =20;

  this.health = 0.50;

  this.dna = [];
  if (dna === undefined) {
    // Food weight
    this.dna[0] = random(-2, 2);
    // Poison weight
    this.dna[1] = random(-2, 2);
    // Food perception
    this.dna[2] = random(0, 100);
    // Poision Percepton
    this.dna[3] = random(0, 100);
    //maximumSpeed
    this.dna[4] = random(1,10);
    //health
    this.dna[5] = random(0.2,0.8);
    //size
    this.dna[6] = random(0,100);
  } else {
    // Mutation
    this.dna[0] = dna[0];
    if (random(1) < mr) {
      this.dna[0] += random(-0.1, 0.1);
    }
    this.dna[1] = dna[1];
    if (random(1) < mr) {
      this.dna[1] += random(-0.1, 0.1);
    }
    this.dna[2] = dna[2];
    if (random(1) < mr) {
      this.dna[2] += random(-10, 10);
    }
    this.dna[3] = dna[3];
    if (random(1) < mr) {
      this.dna[3] += random(-10, 10);
    }
    this.dna[4] = dna[4];
    if (random(1) < mr) {
      this.dna[4] += random(-10, 10);
    }
    this.dna[5] = dna[5];
    if (random(1) < mr) {
      this.dna[5] += random(-0.1, 0.1);
    }
    this.dna[6] = dna[6];
    if (random(1) < mr) {
      this.dna[6] += random(0,100);
    }
  }

  // Method to update location
  this.update = function() {
    this.health -= 0.005;


    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  this.behaviors = function(good, bad) {// This controls towards poison/food
    var steerG = this.eat(good, 0.2, this.dna[2]);
    var steerB = this.eat(bad, -1, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  };

  this.clone = function() { //Reproduction of vehicle. Adopt Pos and DNA
    if (this.health > 0.98) {
      this.health = 0.50;
      return new Vehicle(this.position.x-25, this.position.y,   this.dna);

    } else {
      return null;
    }
  };

  this.eat = function(list, nutrition, perception) { //Vehicle Collison with food
    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.position.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  };

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  };

  this.dead = function() {
    return this.health < 0;
  };

  this.display = function() {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(2);
      ellipse(0, 0, this.dna[2] * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, this.dna[3] * 2);
    }

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);
    imageMode(CENTER);
    image(img,0,0);
    img.resize(this.size, this.size);


    if(this.dna[2] > 90){ //Turn into perceptionbug if perception excedes 90
      imageMode(CENTER);
      image(img3,0,0);
      img3.resize(this.size, this.size);
    }
    if(this.dna[3]>80){ //Turn into poisonperceptionbug if perception excedes 80
      imageMode(CENTER);
      image(img4,0,0);
      img4.resize(this.size, this.size);
    }

    if(this.dna[2]>=80&&this.dna[3]>=80){ //Turn into ultimateperceptionbug
      imageMode(CENTER);
      image(img5,0,0);
      img5.resize(this.size,this.size);
    }

    if(this.dna[4]>9){ //Speed Bug
      imageMode(CENTER);
      image(img6,0,0);
      img6.resize(this.size,this.size);

      this.maxspeed=1.8;

    }
    if(this.dna[6]>=90){ //WaterBug
      imageMode(CENTER);
      image(img7,0,0);
      img7.resize(this.size,this.size);

      this.maxspeed=1.3;

    }



  /*  fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);*/

    pop();
  };

  this.boundaries = function() {
    var d = 25;
    // var riverL = 250;
    // var riverM = 275;
    // var riverR = 300;
    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }
    //RIVER Boundaries START

    if ( this.position.x < riverR && this.position.x > riverM) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > riverL && this.position.x < riverM) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
    // //Mountain boundaries Start
    // if ( this.position.x < mountR && this.position.x > mountM) {
    //   desired = createVector(this.maxspeed, this.velocity.y);
    // } else if (this.position.x > mountL && this.position.x < mountM) {
    //   desired = createVector(-this.maxspeed, this.velocity.y);
    // }

    // if (this.position.y < d) {
    //   desired = createVector(this.velocity.x, this.maxspeed);
    // } else if (this.position.y > mountH - d*2) {
    //   desired = createVector(this.velocity.x, -this.maxspeed);
    // }



    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
/*
    isColliding=false; //THIS IS FOR BOUNDARIES WITH RIVER. Waterbugs can cross
        if(this.position.x < 650 && this.position.x > 600){
          isColliding=true;
        }
        if(this.dna[6]>=90){
          isColliding=false;
        }
        if(isColliding==true && this.position.x < 650){
          this.position.x=750;
        }
        if(isColliding==true && this.position.x > 600){
          this.position.x=500;
        }

        text("Speedbugs Alive: "+speedBugCounter, 10, 50);
*/
  };
}
