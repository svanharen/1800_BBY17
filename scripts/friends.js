function displayCards() {
    let CardTemplate = document.getElementById("CardTemplate");
    firebase.auth().onAuthStateChanged(user => {

        db.collection("users").doc(user.uid).collection("friends").get()
            .then(snap => {
                var i = 1;
                snap.forEach(doc => { //iterate thru each doc
                    var name = doc.data().Name;
                    var score = doc.data().Score;
                    let newcard = CardTemplate.content.cloneNode(true); //clone

                    //update title and text and image
                    newcard.querySelector('.card-title').innerHTML = name;
                    newcard.querySelector('.card-text').innerHTML = score;
                    //give unique ids to all elements for future use
                    // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                    // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);

                    //attach to gallery
                    document.getElementById("friends-go-here").appendChild(newcard);
                })
            })

    });
}
displayCards();