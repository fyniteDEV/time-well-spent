var profile = {};

function getUserInfo() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            profile = JSON.parse(this.responseText);

            document.getElementById("profile").style.display = "flex";
            document.getElementsByTagName("footer")[0].style.display = "block";

            document.getElementById("avatar-img").src = profile.avatar;
            document.getElementById("persona-name").innerHTML = profile.personaName;
            document.getElementById("playtime").innerHTML = "All playtime: " + minsToHoursAndMins(profile.playtime);
            document.getElementById("profile-url").href = profile.profileUrl;
            document.getElementById("unspent-playtime").innerHTML = "Time available: " + minsToHoursAndMins(profile.playtime);


            console.log(profile);
        }
    });

    let steamId = document.getElementById("steamid-input").value;
    xhr.open("GET", "http://127.0.0.1:8000?steamid=" + steamId);

    xhr.send();
}

function minsToHoursAndMins(mins) {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;

    return `${hours} hours ${minutes} minutes`
}