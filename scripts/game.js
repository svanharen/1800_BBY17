//GET HIGHSCORE
function getScore() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Do something for the current logged-in user here:
      console.log(user.uid);
      //go to the correct user document by referencing to the user uid
      currentUserScore = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUserScore.get()
        .then(function (userscore) {
          var user_Score = userscore.data().highscore;
          // console.log(user_Score);
          localStorage.setItem('highscore', user_Score);
        })
    }
  });
}


//GAME
"use strict";
let canvas;
let ctx;

let mouseX;
let mouseY;
let middlePosX;
let characterX;
let characterY = 635;

let mouseButton;

let backgroundPosition = 0;
let backgroundPosition2 = -800;

let score = 0;
let enemy = [];

let characterHeight = 80;
let characterWidth = 35;
let characterWidthDisplay = 55;

let dead = false;

let powers1;
let powers2;
let powers3;

let laserY = 900;
let shield = false;
let gun = 0;
let shoot = 0;
let bulletX;
let bulletY;

//import the images that are used
let image = new Image();
image.src = './images/cartoon-rocket.png';
let off = new Image();
off.src = './images/off.png';
let backgroundImage = new Image();
backgroundImage.src = './images/backgroundImage.jpg';
let backgroundImage2 = new Image();
backgroundImage2.src = './images/backgroundImage.jpg';
let gameTitle = new Image();
gameTitle.src = './images/gameTitle.png';

//import the fonts
let font = new FontFace('coolFont', 'url(./fonts/FFFFORWA.TTF)')

//first load the fonts, then start the game
window.onload = font.load().then(start());

//startup things
function start() {
  document.fonts.add(font);
  canvas = document.getElementById('game');

  //add event listeners for touching the screen
  canvas.addEventListener("touchmove", setMousePosition, false);
  canvas.addEventListener("touchstart", mouseDown, false);
  canvas.addEventListener("touchend", mouseUp, false);
  //disable the menu that shows up if you tap and hold
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  //load powers
  firebase.auth().onAuthStateChanged(user => {
    power_count = db.collection("powers").doc(user.uid).get().then(function (power) {
      powers1 = power.data().power1;
      powers2 = power.data().power2;
      powers3 = power.data().power3;
    })
  });

  //reset all the variables that need to be
  backgroundPosition = 0;
  backgroundPosition2 = -800;

  shield = false;
  gun = 0;
  laserY = 1000;
  shoot = 0;

  enemy = [];
  score = 0;
  ctx = canvas.getContext('2d');
  ctx.textAlign = 'left';
  middlePosX = canvas.width / 2;
  characterX = middlePosX;
  ctx.imageSmoothingEnabled = false;
  //goes and starts the first animation frame
  window.requestAnimationFrame(waiting);
}

//for the screen of the game before you start playing.
function waiting() {
  //if you press the mouse, start
  if (mouseButton == 1) {
    window.requestAnimationFrame(loop);
    dead = false;
    //hide the navbar while playing
    document.getElementById("navBar").style.display = "none";
  } else {
    window.requestAnimationFrame(waiting);
  }

  //draw the game images, but they dont do anything
  ctx.drawImage(backgroundImage, 0, backgroundPosition, canvas.width * 1.5, canvas.height);
  ctx.drawImage(off, characterX, characterY, characterWidthDisplay, characterHeight);
  ctx.drawImage(gameTitle, 37.5, 300, 300, 225);
  ctx.font = "15px coolFont";
  ctx.fillStyle = "white";
  ctx.fillText("Highscore: " + localStorage.getItem('highscore'), 10, 80);
}

//loop the animation unless you are dead.
function loop(timeStamp) {
  //if you are not dead, request next frame
  if (dead == false) {
    update();
    //request next frame
    window.requestAnimationFrame(loop);
  }
}
//----------------------------------------------------------------
//finds set the mouse position
function setMousePosition(e) {
  //set position for moving back and forth
  let rect = canvas.getBoundingClientRect();
  scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
  scaleY = canvas.height / rect.height;
  mouseX = (e.targetTouches[0].pageX - rect.left) * scaleX; //uses touch to set mouse position
  mouseY = (e.targetTouches[0].pageY - rect.left) * scaleY;
  // mouseButton = 1;
}

function mouseDown(e) {
  let rect = canvas.getBoundingClientRect();
  scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
  scaleY = canvas.height / rect.height;
  mouseX = (e.targetTouches[0].pageX - rect.left) * scaleX; //uses touch to set mouse position
  mouseY = (e.targetTouches[0].pageY - rect.left) * scaleY;
  mouseButton = 1;
}

function mouseUp(e) {
  mouseButton = 0;
  mouseX = 0;
  mouseY = 0;
}
//---------------------------------------------------------------
//the loop
function update() {
  //clear the window to not get funky overlay
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBackground();

  //updates the character if touching screen
  if (mouseButton == 1) {
    updateCharacter();
  }
  ctx.drawImage(image, characterX, characterY, characterWidthDisplay, characterHeight);

  updateEnemy();

  updatePowers();

  updateScore();
}

//sets the character position based on the input
function updateCharacter() {
  if (mouseX < (canvas.width / 2) && characterX > 0) {
    characterX -= 3;
  } else if (mouseX >= (canvas.width / 2) && characterX <= canvas.width - 55) {
    characterX += 3;
  }
}

let gap = 0;

let red = new Image();
red.src = './images/red.png';
let green = new Image();
green.src = './images/green.png';
let blue = new Image();
blue.src = './images/blue.png';

let notTap = 0;

let virusSpeedY = 2;
let virusSpeedX = 0.3;
let randomColor = 0;
let gapAmount;

//update the enemy's array
function updateEnemy() {
  gap++;
  gapAmount = (score < 50) ? 120 : 90; //if you get past 50, it gets harder
  if (gap % gapAmount === 0) {
    //set random size, color, direction
    randomSize = Math.random() * 75 + 35;
    randomColor = Math.random() * 4;
    randomDirection = Math.random() * 2;
    if (randomColor < 1) {
      randomColor = 1;
    } else if (randomColor < 2) {
      randomColor = 2;
    } else {
      randomColor = 3;
    }
    random = Math.random() * (canvas.width - randomSize);
    enemy.push({
      x: random,
      y: -100,
      w: randomSize,
      h: randomSize,
      c: randomColor,
      d: randomDirection
    });
    gapCap = Math.random() * 45;
  }

  for (let i = 0; i < enemy.length; i++) {
    let b = enemy[i];
    let grace = 25;
    //check for collision on x axis
    if ((b.x > characterX && (b.x < (characterX + characterWidth))) || (((b.x + b.w) > characterX) && ((b.x + b.w) < (characterX + characterWidth))) || (((b.x + (b.w / 2)) > characterX) && ((b.x + (b.w / 2)) < (characterX + characterWidth)))) {
      //check for collision on y axis
      if ((((b.y + b.h) > (characterY + grace)) && (b.y + b.h) < ((characterY + characterHeight) - grace)) || (((b.y) > (characterY + grace)) && b.y < ((characterY + characterHeight) - grace))) {
        //if no shield then die
        if (!shield) {
          dead = true;
          mouseButton = 0;
          //updates powerups in firebase
          firebase.auth().onAuthStateChanged(user => {
            setPower = db.collection("powers").doc(user.uid);
            setPower.update({
              power1: parseInt(powers1),
              power2: parseInt(powers2),
              power3: parseInt(powers3)
            });
          });
          gameOver();
        } else {
          shield = false;
          enemy.splice(i, 1);
        }
      }
    }

    if (b.y > canvas.height) {
      enemy.splice(i, 1);
      score++;
    }

    //updates the position
    if (b.d < 1) {
      if (b.c == 1) {
        ctx.drawImage(red, b.x += virusSpeedX, b.y += virusSpeedY, b.w, b.h);
      } else if (b.c == 2) {
        ctx.drawImage(green, b.x += virusSpeedX, b.y += virusSpeedY, b.w, b.h);
      } else {
        ctx.drawImage(blue, b.x += virusSpeedX, b.y += virusSpeedY, b.w, b.h);
      }
    } else {
      if (b.c == 1) {
        ctx.drawImage(red, b.x -= virusSpeedX, b.y += virusSpeedY, b.w, b.h);
      } else if (b.c == 2) {
        ctx.drawImage(green, b.x -= virusSpeedX, b.y += virusSpeedY, b.w, b.h);
      } else {
        ctx.drawImage(blue, b.x -= virusSpeedX, b.y += virusSpeedY, b.w, b.h);
      }
    }

    //check if its hit by the laser
    if (b.y > laserY) {
      enemy.splice(i, 1);
      score++;
    }

    //if hit by laser gun
    if (bulletY > b.y && bulletY < b.y + b.w && bulletX > b.x && bulletX < b.x + b.w) {
      shoot = 0;
      enemy.splice(i, 1);
    }
  }

}

//infinite scrolling background
function updateBackground() {
  ctx.drawImage(backgroundImage, 0, backgroundPosition, canvas.width * 1.5, canvas.height);
  ctx.drawImage(backgroundImage2, 0, backgroundPosition2, canvas.width * 1.5, canvas.height);
  backgroundPosition += 0.25;
  backgroundPosition2 += 0.25;
  if (backgroundPosition >= 800) {
    backgroundPosition = -800;
  }
  if (backgroundPosition2 >= 800) {
    backgroundPosition2 = -800;
  }
}


let buttonScale = 55;
let lighting = false;

/*
updates the score in the top corner.
*/
function updateScore() {
  //show text for highscore and score
  ctx.textAlign = 'left';
  ctx.font = "15px coolFont";
  ctx.fillText("Highscore: " + localStorage.getItem('highscore'), 10, 90);
  ctx.fillText("Score: " + score, 10, 110);
  newHS = false;
}
let newHS;

let uvLight = new Image();
uvLight.src = './images/uvlight.png';
let laser = new Image();
laser.src = './images/laser.png';

let shieldLogo = new Image();
shieldLogo.src = './images/shieldlogo.png';
let shieldImage = new Image();
shieldImage.src = './images/shield.png';

let gunLogo = new Image();
gunLogo.src = './images/enableGun.png';
let gunImage = new Image();
gunImage.src = './images/gun.png';
let gunButton = new Image();
gunButton.src = './images/gunButton.png';
let bullet = new Image();
bullet.src = './images/bullet.png';

/*
does the 3 different types of powers
*/
function updatePowers() {

  updateUVLight();

  updateShield();

  updateGun();
}

/*
updates the powerup the clears the screen of enemies
*/
function updateUVLight() {
  //draw and check if uv light button is pushed
  if (lighting == false) {
    ctx.drawImage(uvLight, 10, 125, buttonScale, buttonScale);
    ctx.font = "15px coolFont";
    if (powers1) {
      ctx.fillText(powers1, 15 + buttonScale, 160);
    }
  }
  //only print power count if it is loaded

  //do powerup
  if (lighting) {
    console.log("lighting")
    ctx.drawImage(laser, 0, laserY, canvas.width, 130);
    laserY -= 5;
    if (laserY < -100) {
      lighting = false;
      laserY = 1000;
      console.log("done")
    }
  } else {
    laserY = 1000;
  }
  //check if you click the button
  if (mouseX > 10 && mouseX < buttonScale + 10 && mouseY > 125 && mouseY < buttonScale + 125 && powers1 > 0) {
    if (lighting == false) {
      lighting = true;
      powers1--;
      console.log("start")
    }
  }
}

/*
update the shield powerup
*/
function updateShield() {
  //draw and check if shield button is pushed
  if (shield == false) {
    ctx.drawImage(shieldLogo, 10, 200, buttonScale, buttonScale);
    ctx.font = "15px coolFont";
    //only print power count if it is loaded
    if (powers2) {
      ctx.fillText(powers2, 15 + buttonScale, 235);
    }
  }

  if (shield) {
    ctx.drawImage(shieldImage, characterX - 20, characterY - 20, characterWidthDisplay + 40, characterHeight + 40);
  }
  //check if you click the button
  if (mouseX > 10 && mouseX < buttonScale + 10 && mouseY > 200 && mouseY < buttonScale + 200 && powers2 > 0) {
    if (shield == false) {
      shield = true;
      powers2--;
    }
  }
}


/*
update the gun powerup
*/
function updateGun() {
  //draw and check if gun button is pushed
  if (gun == 0) {
    ctx.drawImage(gunLogo, 10, 275, buttonScale, buttonScale);
    ctx.font = "15px coolFont";
    //only print power count if it is loaded
    if (powers3) {
      ctx.fillText(powers3, 15 + buttonScale, 310);
    }
  }
  //shoots the gun
  if (gun == 1) {
    ctx.drawImage(gunImage, characterX, characterY - 42, characterWidthDisplay, characterHeight * 0.75);
    ctx.drawImage(gunButton, 50, 740, 275, 50);
    if (mouseX > 50 && mouseX < 325 && mouseY > 740 && mouseY < 790 && shoot == 0 && mouseButton == 1) {
      shoot = 1;
      bulletX = characterX + (characterWidth / 2);
      bulletY = characterY;
    }
  } else {
    shoot = 0;
  }

  if (shoot == 1) {
    ctx.drawImage(bullet, bulletX, bulletY, 15, 20);
    bulletY -= 8;
  } else {
    bulletX = -10;
    bulletY = -10;
  }

  if (bulletY < 0) {
    shoot = 0;
  }

  //check if you click the button
  if (mouseX > 10 && mouseX < buttonScale + 10 && mouseY > 275 && mouseY < buttonScale + 275 && powers3 > 0) {
    if (gun == 0) {
      gun = 1;
      powers3--;
    }
  }
}

/*
Runs when you die.
*/
function gameOver() {
  //if you click go back to main menu
  //not tap is to make sure they arent still tapping from the game
  console.log(notTap);
  if (mouseButton == 1) {
    window.requestAnimationFrame(start);
    mouseButton = 0;
  } else {
    window.requestAnimationFrame(gameOver);
  }

  //check if you have a new highscore
  if (score > localStorage.getItem('highscore')) {
    localStorage.setItem('highscore', score);
    firebase.auth().onAuthStateChanged(user => {
      setScore = db.collection("users").doc(user.uid);
      setScore.update({
        highscore: score
      });
      newHS = true;
    });
  }

  //clear the window to not get funky overlay
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width * 1.5, canvas.height);
  ctx.font = "40px coolFont";
  ctx.textAlign = 'center';
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 3);
  ctx.font = "20px coolFont";
  ctx.fillText("High Score: " + localStorage.getItem('highscore'), canvas.width / 2, canvas.height / 2);
  if (newHS) {
    ctx.font = "30px coolFont";
    ctx.fillText("New High Score!!", canvas.width / 2, canvas.height * (2 / 3));
  }
  //show navbar
  document.getElementById("navBar").style.display = "block";
}