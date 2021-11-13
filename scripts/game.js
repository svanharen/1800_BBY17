//GET HIGHSCORE VVVVVVVVVVVVV
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


//GAME VVVVVV
"use strict";
let canvas;
let ctx;
let mouseX;
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
let font = new FontFace('coolFont', 'url(./fonts/FFFFORWA.TTF)')

window.onload = font.load().then(start());

//startup things
function start() {
  document.fonts.add(font);
  canvas = document.getElementById('game');
  canvas.addEventListener("touchmove", setMousePosition, false);
  canvas.addEventListener("touchstart", mouseDown, false);
  canvas.addEventListener("touchend", mouseUp, false);
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });
  backgroundPosition = 0;
  backgroundPosition2 = -800;
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

function waiting() {
  if (mouseButton == 1) {
    window.requestAnimationFrame(loop);
    dead = false;
    //hide the navbar while playing
    document.getElementById("navBar").style.display = "none";
  } else {
    window.requestAnimationFrame(waiting);
  }
  ctx.drawImage(backgroundImage, 0, backgroundPosition, canvas.width * 1.5, canvas.height);
  ctx.drawImage(off, characterX, characterY, characterWidthDisplay, characterHeight);
  ctx.drawImage(gameTitle, 37.5, 300, 300, 225);
  ctx.font = "15px coolFont";
  ctx.fillStyle = "white";
  ctx.fillText("Highscore: " + localStorage.getItem('highscore'), 10, 80);
}


function loop(timeStamp) {
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
  scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
    mouseX = (e.targetTouches[0].pageX - rect.left) * scaleX;
}

function mouseDown(e) {
  let rect = canvas.getBoundingClientRect();
  scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
    mouseX = (e.targetTouches[0].pageX - rect.left) * scaleX;
  mouseButton = 1;
}

function mouseUp(e) {
  mouseButton = 0;
}
//---------------------------------------------------------------
//the loop
function update() {
  //clear the window to not get funky overlay
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBackground();

  //updates the character
  if (mouseButton == 1) {
    updateCharacter();
  }
  ctx.drawImage(image, characterX, characterY, characterWidthDisplay, characterHeight);

  updateEnemy();

  updateScore();
}

//sets the character position based on the input
function updateCharacter() {
  if (mouseX < (canvas.width / 2) && characterX > 0) {
    characterX -= 2;
  } else if (mouseX >= (canvas.width / 2) && characterX <= canvas.width - 55) {
    characterX += 2;
  }
}

let gapCap = 20;
let gap = 0;

let red = new Image();
red.src = './images/red.png';
let green = new Image();
green.src = './images/green.png';
let blue = new Image();
blue.src = './images/blue.png';

let virusSpeedY = 1;
let virusSpeedX = 0.15;
let randomColor = 0;

function updateEnemy() {
  gap++;
  if (gap % 120 === 0) {
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
        dead = true;
        gameOver();
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

function updateScore() {
  ctx.textAlign = 'left';
  ctx.fillText("Highscore: " + localStorage.getItem('highscore'), 10, 90);
  ctx.fillText("Score: " + score, 10, 110);
  newHS = false;
}
let newHS;

function gameOver() {
  if (mouseButton == 1) {
    window.requestAnimationFrame(start);
    mouseButton = 0;
  } else {
    window.requestAnimationFrame(gameOver);
  }

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