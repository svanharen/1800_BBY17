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
window.onload = start;

function start() {
  canvas = document.getElementById('game');
  canvas.addEventListener("touchmove", setMousePosition, false);
  canvas.addEventListener("touchstart", mouseDown, false);
  canvas.addEventListener("touchend", mouseUp, false);
  ctx = canvas.getContext('2d');
  middlePosX = canvas.width / 2;
  characterX = middlePosX;
  //goes and starts the first animation frame
  window.requestAnimationFrame(loop);
}

function loop(timeStamp) {
  update();

  //request next frame
  window.requestAnimationFrame(loop);
}


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



function update() {
  //clear the window to not get funky overlay
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, middlePosX, canvas.height);
  updateCharacter();
}

function updateCharacter() {
  //checks if the user taps

  if (mouseButton == 1) {

    if (mouseX < (canvas.width / 2)) {
      characterX--;
    } else {
      characterX++
    }
  }

}