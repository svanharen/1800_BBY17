const icon = "./images/green.png";

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
                showNotification("My Notification", "Hello World", icon);




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

function testNotify(){

    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            showNotification("My Notification", "Hello World", icon);
        } else {
            // request permission from user
            Notification.requestPermission().then(function(p) {
               if(p === 'granted') {
                showNotification("My Notification", "Hello World", icon);
               } else {
                   console.log('User blocked notifications.');
               }
            }).catch(function(err) {
                console.error(err);
            });
        }
    }
}

function showNotification(title, text) {
    const notification = new Notification(title, {
        body: text,
        icon: icon
    });

}

