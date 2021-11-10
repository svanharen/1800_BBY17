//GET HIGHSCORE VVVVVVVVVVVVV
function getScore() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      // Do something for the current logged-in user here:
      console.log(user.uid);
      //go to the correct user document by referencing to the user uid
      currentUserScore = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUserScore.get()
        .then(function (userscore) {
          var user_Score = userscore.data().highscore;
          console.log(user_Score);
          //method #1:  insert with html only
          localStorage.setItem('highscore', user_Score);
          //method #2:  insert using jquery
          //$("#score-goes-here").text(user_Score); //using jquery
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
let backgroundImage = new Image();
backgroundImage.src = './images/backgroundImage.jpg';
let backgroundImage2 = new Image();
backgroundImage2.src = './images/backgroundImage.jpg';
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
  window.requestAnimationFrame(loop);
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

function updateEnemy() {

}

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
