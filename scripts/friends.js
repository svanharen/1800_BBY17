/*
Displays the cards that have the friends of the user. Gets from firebase.
*/
function displayCards() {
    let CardTemplate = document.getElementById("CardTemplate");
    firebase.auth().onAuthStateChanged(user => {

        db.collection("users").doc(user.uid).collection("friends").get()
            .then(snap => {
                snap.forEach(doc => { //iterate thru each doc
                    var name = doc.data().Name;

                    console.log(name);

                    let score = 0;
                    firebase.auth().onAuthStateChanged(user => {
                        db.collection("users").where("name", "==", name)
                            .get()
                            .then(function (highscore1) {
                                highscore1.forEach(function (doc) {
                                    score = doc.data().highscore;
                                });
                            }).then(function () {
                                //var score = doc.data().Score;
                                let newcard = CardTemplate.content.cloneNode(true); //clone

                                //update title and text and image
                                newcard.querySelector('.card-title').innerHTML = name;
                                newcard.querySelector('.card-text2').innerHTML = score;

                                document.getElementById("friends-go-here").appendChild(newcard);
                            });
                    });
                })
            })

    });
}
displayCards();

/*
Add a new friend by searching for thier name in firebase using .where()
*/
function addFriend() {
    try {
        let exists = 0;
        var newFriend = document.getElementById("newFriend").value;
        db.collection("users").where("name", "==", newFriend).get()
            .then(function (friend1) {
                console.log("2");
                friend1.forEach(function (doc) {
                    console.log("3");
                    exists = 1;
                });
            })
            .then(function () {
                if (!exists) {
                    document.getElementById("error").textContent = "User not found.";
                } else {
                    console.log("4");
                    firebase.auth().onAuthStateChanged(user => {
                        db.collection("users").doc(user.uid).collection("friends")
                            .add({
                                Name: newFriend
                            })
                            .then(function (){
                                window.location.reload(true);
                            });
                    });
                }
            });

    } catch (error) {
        console.log("rip")
        document.getElementById("error").textContent = "User not found. \n" + error;
    }
}