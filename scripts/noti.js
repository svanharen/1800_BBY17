const icon = "./images/green.png";

function notify() {
    if (Notification.permission === "granted") {
        showNotification("Don't Forget!", "Track your spending!", icon);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission()
            .then(permission => {

                if (permission === "granted") {
                    showNotification("My Notification", "Hello World", icon);
                }

            });
    }
}

function showNotification(title, text) {
    const notification = new Notification(title, {
        body: text,
        icon: icon
    });

}