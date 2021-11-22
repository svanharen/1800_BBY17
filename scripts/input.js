let radio;
let update = 0;
var rating;

function inputRating() {
    //make sure the rating is valid;
    let input = document.getElementById("cost").value;
    rating = document.getElementById("rating").value;
    localStorage.setItem("rating", rating);
    let stop = 0;
    if (input < 1 || rating < 1) { //only run if both fields have data in them
        stop = 1;
    }
    if (stop == 0) {
        console.log("hi");
        if (input > 10) {
            input = 10;
        } else if (input < 1) {
            input = 1;
        }

        if (document.getElementById("btnradio1").checked) {
            radio = 1;
        } else if (document.getElementById("btnradio2").checked) {
            radio = 2;
        } else if (document.getElementById("btnradio3").checked) {
            radio = 3;
        } else if (document.getElementById("btnradio4").checked) {
            radio = 4;
        } else if (document.getElementById("btnradio5").checked) {
            radio = 5;
        } else if (document.getElementById("btnradio6").checked) {
            radio = 6;
        } else if (document.getElementById("btnradio7").checked) {
            radio = 7;
        }

        firebase.auth().onAuthStateChanged(user => {
                save = db.collection("history").doc(user.uid);
                switch (radio) {
                    case 1:
                        save.get().then(function (update_food) {
                            update = update_food.data().food;
                            update = update + parseFloat(document.getElementById("cost").value);
                            console.log(update);
                        }).then(function () {
                            save.update({
                                food: update
                            });
                        }).then(function(){
                            window.location.href = 'rewards.html';
                        });
                        break;
                    case 2:
                        save.get().then(function (update_drink) {
                            update = update_drink.data().drink;
                            update = update + parseFloat(document.getElementById("cost").value);
                            console.log(update);
                        }).then(function () {
                            save.update({
                                drink: update
                            });
                        }).then(function(){
                            window.location.href = 'rewards.html';
                        });
                        break;
                    case 6:
                        save.get().then(function (update_entertainment) {
                            update = update_entertainment.data().entertainment;
                            update = update + parseFloat(document.getElementById("cost").value);
                            console.log(update);
                        }).then(function () {
                            save.update({
                                entertainment: update
                            });
                        }).then(function(){

                            window.location.href = 'rewards.html';
                        });
                        break;
                    case 3:
                        save.get().then(function (update_shopping) {
                            update = update_shopping.data().shopping;
                            update = update + parseFloat(document.getElementById("cost").value);
                            console.log(update);
                        }).then(function () {
                            save.update({
                                shopping: update
                            });
                        }).then(function(){
                            window.location.href = 'rewards.html';
                        });
                        break;
                    case 4:
                        save.get().then(function (update_transportation) {
                            update = update_transportation.data().transportation;
                            update = update + parseFloat(document.getElementById("cost").value);
                            console.log(update);
                        }).then(function () {
                            save.update({
                                transportation: update
                            });
                        }).then(function(){
                            window.location.href = 'rewards.html';
                        });
                        break;
                    case 5:
                        save.get().then(function (update_school) {
                            update = update_school.data().school;
                            update = update + parseFloat(document.getElementById("cost").value);
                            console.log(update);
                        }).then(function () {
                            save.update({
                                school: update
                            });
                        }).then(function(){
                            window.location.href = 'rewards.html';
                        });
                        break;
                    case 7:
                        save.get().then(function (update_misc) {
                            update = update_misc.data().misc;
                            update = update + parseFloat(document.getElementById("cost").value);
                            console.log(update);
                        }).then(function () {
                            save.update({
                                misc: update
                            });
                        }).then(function(){
                            window.location.href = 'rewards.html';
                        });
                        break;

                    default:
                        break;
                }
            });
    } else {
        document.getElementById("submitButton").textContent = "Please fill in all the fields";
    }
}

function getPrize() {
    let powers1 = 0;
    let powers2 = 0;
    let powers3 = 0;
    rating = localStorage.getItem("rating");

    if (rating >= 8) {
        powers3 = parseInt(Math.random() * 3);
        powers2 = parseInt(Math.random() * 3);
        powers1 = parseInt(Math.random() * 5);
        if (powers3 == 0 && powers2 == 0 && powers1 == 0) {
            powers1 = 1;
        }
    } else if (rating >= 5) {
        powers2 = parseInt(Math.random() * 2);
        powers1 = parseInt(Math.random() * 3);
        if (powers2 == 0 && powers1 == 0) {
            powers1 = 1;
        }
    } else {
        powers2 = parseInt(Math.random() * 2);
        powers1 = parseInt(Math.random() * 2);
        if (powers2 == 0 && powers1 == 0) {
            powers1 = 1;
        }
    }

    document.getElementById("UVCount").textContent = powers1;
    document.getElementById("shieldCount").textContent = powers2;
    document.getElementById("gunCount").textContent = powers3;

    if (powers1 <= 0) {
        document.getElementById("UV").style.display = 'none';
    } else {
        document.getElementById("UV").style.display = 'block';
    }
    if (powers2 <= 0) {
        document.getElementById("shield").style.display = 'none';
    } else {
        document.getElementById("shield").style.display = 'block';
    }

    if (powers3 <= 0) {
        document.getElementById("gun").style.display = 'none';
    } else {
        document.getElementById("gun").style.display = 'block';
    }


    firebase.auth().onAuthStateChanged(user => {
        power_count = db.collection("powers").doc(user.uid).get().then(function (power) {
            powers1 = power.data().power1 + powers1;
            powers2 = power.data().power2 + powers2;
            powers3 = power.data().power3 + powers3;
        }).then(function () {
            setPower = db.collection("powers").doc(user.uid);
            setPower.update({
                power1: parseInt(powers1),
                power2: parseInt(powers2),
                power3: parseInt(powers3)
            })
        })
    });

}

//used to reset user data
// function reset() {
//     firebase.auth().onAuthStateChanged(user => {
//         set2 = db.collection("history").doc(user.uid);
//         set2.set({
//             food: 0,
//             drink: 0,
//             shopping: 0,
//             transportation: 0,
//             school: 0,
//             entertainment: 0,
//             work: 0,
//             budget: 0
//         }).then(function () {
//             setPower = db.collection("powers").doc(user.uid);
//             setPower.update({
//                 power1: 0,
//                 power2: 0,
//                 power3: 0
//             })
//         })
//     });

// }