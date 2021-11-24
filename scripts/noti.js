(async () => {
    const icon = "./images/green.png";

    if (Notification.permission === "granted")
    {
        showNotification("My Notification", "Hello World", icon);
    }
    else if (Notification.permission !== "denied")
    {
        Notification.requestPermission()
                .then(permission => {

                    if (permission === "granted")
                    {
                        showNotification("My Notification", "Hello World", icon);
                    }

                });
    }

    function showNotification(title, text) {
        const notification = new Notification(title, {
            body: text,
            icon: icon
        });

        notification.onclick = (event) => {
            window.location.href = "https://appiomatic.com/blog";
        };
    }

})();