function getSettings() {
    let loadedSettings = 0;
    let loadedSettings2 = 0;
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here:
            console.log(user.uid);
            //go to the correct user document by referencing to the user uid
            notifications = db.collection("users").doc(user.uid);
            //get the document for current user.
            notifications.get()
                .then(function (notify_type) {
                    var user_setting = notify_type.data().notificationReminder;
                    if (user_setting == 0) {
                        localStorage.setItem('radio1', 1);
                        localStorage.setItem('radio2', 0);
                        loadedSettings = 1;
                        //document.getElementById("daily").checked = true;
                    } else {
                        localStorage.setItem('radio2', 1);
                        localStorage.setItem('radio1', 0);
                        loadedSettings = 1;
                        //document.getElementById("weekly").checked = true;
                    }

                });
            notifications.get()
                .then(function (notify_type) {
                    var user_setting = notify_type.data().notificationType;
                    console.log(user_setting);
                    if (user_setting == 0) {
                        localStorage.setItem('radio3', 1);
                        localStorage.setItem('radio4', 0);
                        localStorage.setItem('radio5', 0);
                        loadedSettings2 = 1;
                        //document.getElementById("lockscreen").checked = true;
                    } else if (user_setting == 1) {
                        localStorage.setItem('radio3', 0);
                        localStorage.setItem('radio4', 1);
                        localStorage.setItem('radio5', 0);
                        loadedSettings2 = 1;
                        //document.getElementById("banner").checked = true;
                    } else {
                        localStorage.setItem('radio3', 0);
                        localStorage.setItem('radio4', 0);
                        localStorage.setItem('radio5', 1);
                        loadedSettings2 = 1;
                        //document.getElementById("notiCenter").checked = true;
                    }
                }).then(function () {
                    try {
                        setSettings();
                    } catch (error) {

                    }
                });
            notifications.get()
                .then(function (budget) {
                    var user_setting = budget.data().timePeriod;
                    if (user_setting == 0) {
                        localStorage.setItem('budgetButton1', 1);
                        localStorage.setItem('budgetButton2', 0);
                    } else {
                        localStorage.setItem('budgetButton1', 0);
                        localStorage.setItem('budgetButton2', 1);
                    }

                });
            budgetDB = db.collection("history").doc(user.uid);
            budgetDB.get().then(function (budget) {
                localStorage.setItem('budget', budget.data().budget);
            });

        }
    });
}
function setSettings() {
    console.log(localStorage.getItem('radio1'));
    if (localStorage.getItem('radio1') == 1) {
        document.getElementById("daily").checked = true;
    } else {
        document.getElementById("weekly").checked = true;
    }
    if (localStorage.getItem('radio3') == 1) {
        document.getElementById("lockscreen").checked = true;
    } else if (localStorage.getItem('radio4') == 1) {
        document.getElementById("banner").checked = true;
    } else {
        document.getElementById("notiCenter").checked = true;
    }
}

function setSettings2() {
    if (localStorage.getItem('budgetButton1') == 1) {
        document.getElementById("month").checked = true;
    } else {
        document.getElementById("twoweeks").checked = true;
    }
    console.log(localStorage.getItem('budget'))
    document.getElementById("totalBudget").value = localStorage.getItem('budget');
}

//updates to the firebase when you press the different radio buttons
// Notification time period!
function Daily() {
    firebase.auth().onAuthStateChanged(user => {
        set2 = db.collection("users").doc(user.uid);
        set2.update({
            notificationReminder: 0
        });
        localStorage.setItem('radio1', 1);
        localStorage.setItem('radio2', 0);
        // getSettings();
    });

}

function Weekly() {
    firebase.auth().onAuthStateChanged(user => {
        set2 = db.collection("users").doc(user.uid);
        set2.update({
            notificationReminder: 1
        });
        localStorage.setItem('radio2', 1);
        localStorage.setItem('radio1', 0);
    });
}

// Notification types! 
function Lockscreen() {
    firebase.auth().onAuthStateChanged(user => {
        set2 = db.collection("users").doc(user.uid);
        set2.update({
            notificationType: 0
        });
        localStorage.setItem('radio3', 1);
        localStorage.setItem('radio4', 0);
        localStorage.setItem('radio5', 0);
        //  getSettings();
    });
}

function Banner() {
    firebase.auth().onAuthStateChanged(user => {
        set2 = db.collection("users").doc(user.uid);
        set2.update({
            notificationType: 1
        });
        localStorage.setItem('radio3', 0);
        localStorage.setItem('radio4', 1);
        localStorage.setItem('radio5', 0);
        // getSettings();
    });
}

function NotiCenter() {
    firebase.auth().onAuthStateChanged(user => {
        set2 = db.collection("users").doc(user.uid);
        set2.update({
            notificationType: 2
        });
        localStorage.setItem('radio3', 0);
        localStorage.setItem('radio4', 0);
        localStorage.setItem('radio5', 1);
        // getSettings();
    });
}

function budgetMonth() {
    localStorage.setItem("budgetButton1", 1);
    localStorage.setItem("budgetButton2", 0);
}

function budgetWeek() {
    localStorage.setItem("budgetButton1", 0);
    localStorage.setItem("budgetButton2", 1);
}

function save() {
    firebase.auth().onAuthStateChanged(user => {
        set1 = db.collection("users").doc(user.uid);
        if (localStorage.getItem("budgetButton1") == 1) {
            set1.update({
                //month
                timePeriod: 0
            });
        } else {
            set1.update({
                //two weeks
                timePeriod: 1
            });
        }
        set2 = db.collection("history").doc(user.uid);
        newbudget = parseFloat(document.getElementById("totalBudget").value);
        console.log(newbudget);
        set2.update({
            budget: newbudget
        });
        localStorage.setItem('budget', newbudget);

    });
    document.getElementById("saved").textContent = "Saved!";
}