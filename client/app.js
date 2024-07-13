function getUserInfo() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    let steamId = document.getElementById("steamid-input").value;
    xhr.open("GET", "http://127.0.0.1:8000?steamid=" + steamId);

    xhr.send();
}