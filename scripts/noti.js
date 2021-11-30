const icon = "./images/green.png";

/*
Does notifications when the day is right.
*/
function notify() {
    const today = new Date();
    const lastDate = localStorage.getItem('lastDate');
    let interval = 0;

    if(today.getDay > lastDate || (lastDate == 6 && today.getDay == 0)){
        localStorage.setItem('daysSinceNotify', Math.abs(getDay - lastDate));
    }
    if (localStorage.getItem('radio1') == 1) {
        interval = 1;
    } else {
        interval = 6;
    }
    console.log(interval);

    if (!window.Notification && localStorage.getItem('daysSinceNotify') == interval) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            showNotification("Don't Forget!", "Track your spending!", icon);
            localStorage.setItem('daysSinceNotify', 0);
            localStorage.setItem('lastDate', today.getDay);
        } else {
            // request permission from user
            Notification.requestPermission().then(function(p) {
               if(p === 'granted') {
                showNotification("Don't Forget!", "Track Your Spending!", icon);




                localStorage.setItem('daysSinceNotify', 0);
                localStorage.setItem('lastDate', today.getDay);
                console.log("hi");
               } else {
                   console.log('User blocked notifications.');
               }
            }).catch(function(err) {
                console.error(err);
            });
        }
    }
}

/*
Send a notification as a test for the demonstration.
*/
function testNotify(){

    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            showNotification("Don't Forget!", "Track Your Spending!", icon);
        } else {
            // request permission from user
            Notification.requestPermission().then(function(p) {
               if(p === 'granted') {
                showNotification("Don't Forget!", "Track Your Spending!", icon);
               } else {
                   console.log('User blocked notifications.');
               }
            }).catch(function(err) {
                console.error(err);
            });
        }
    }
}

/*
Shows the actual notification.
*/
function showNotification(title, text) {
    const notification = new Notification(title, {
        body: text,
        icon: icon
    });

}

