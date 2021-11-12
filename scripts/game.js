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
let mouseButton;
let backgroundPosition = 0;
let backgroundPosition2 = -800;
let enemy = [];
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
window.onload = start;

//startup things
function start() {
  canvas = document.getElementById('game');
  canvas.addEventListener("touchmove", setMousePosition, false);
  canvas.addEventListener("touchstart", mouseDown, false);
  canvas.addEventListener("touchend", mouseUp, false);
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });
  ctx = canvas.getContext('2d');
  middlePosX = canvas.width / 2;
  characterX = middlePosX;
  ctx.imageSmoothingEnabled = false;
  //goes and starts the first animation frame
  window.requestAnimationFrame(waiting);
}
function waiting(){
  if(mouseButton == 1){
    window.requestAnimationFrame(loop);
  } else {
    window.requestAnimationFrame(waiting);
  }
  ctx.drawImage(backgroundImage, 0, backgroundPosition, canvas.width * 1.5, canvas.height);
  ctx.drawImage(off, characterX, 650, 55, 80);
  ctx.drawImage(gameTitle, 37.5, 300, 300, 225);
}


function loop(timeStamp) {
  update();
  //request next frame
  window.requestAnimationFrame(loop);
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
  ctx.drawImage(image, characterX, 650, 55, 80);

  updateEnemy();
  //setTimeout(update, 1);
}

//sets the character position based on the input
function updateCharacter() {
  if (mouseX < (canvas.width / 2) && characterX > 0) {
    characterX -= 2;
  } else if (mouseX >= (canvas.width / 2) && characterX <= canvas.width - 15) {
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
virusSpeed = 1;
let randomColor = 0;
function updateEnemy() {
 console.log(gapCap);
   gap++;
  if(gap % 150 === 0){
    randomSize = Math.random() * 50 + 35;
    randomColor = Math.random();
    console.log(randomColor);
    if(randomColor < 1){
      randomColor = 1;
    } else if (randomColor < 2){
      randomColor = 2;
    } else {
      randomColor = 3;
    }
    console.log(randomColor);
    random = Math.random() * (canvas.width - randomSize);
    enemy.push({x: random, y: -100, w: randomSize, h: randomSize, c: randomColor});
    gapCap = Math.random() * 45;
  }

  for(let i = 0; i < enemy.length; i++){
    let b = enemy[i];
    //check for colisions
    if(b.y > canvas.height){
      enemy.splice(i, 1);
      console.log("hi");
    }

    if(b.c == 1){
      ctx.drawImage(red, b.x, b.y += virusSpeed, b.w, b.h);
    } else if (b.c = 2){
      ctx.drawImage(green, b.x, b.y += virusSpeed, b.w, b.h);
    } else {
      ctx.drawImage(blue, b.x, b.y += virusSpeed, b.w, b.h);
    }
  }

}

//infinite scrolling background
function updateBackground() {
  ctx.drawImage(backgroundImage, 0, backgroundPosition, canvas.width * 1.5, canvas.height);
  ctx.drawImage(backgroundImage2, 0, backgroundPosition2, canvas.width * 1.5, canvas.height);
  backgroundPosition += 0.25;
  backgroundPosition2 += 0.25;
  if(backgroundPosition >= 800){
    backgroundPosition = -800;
  }
  if(backgroundPosition2 >= 800){
    backgroundPosition2 = -800;
  }
}
