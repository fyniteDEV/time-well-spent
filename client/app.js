var profile = {};

function getUserInfo() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            profile = JSON.parse(this.responseText);

            // Unhide elements
            document.getElementById("profile").style.display = "flex";
            document.getElementById("main-content-container").style.display = "block";
            document.getElementsByTagName("footer")[0].style.display = "block";

            // Load in values of the given profile
            document.getElementById("avatar-img").src = profile.avatar;
            document.getElementById("persona-name").innerHTML = profile.personaName;
            document.getElementById("playtime").innerHTML = "All playtime: " + minsToHoursAndMins(profile.playtime);
            document.getElementById("profile-url").href = profile.profileUrl;
            document.getElementById("unspent-playtime").innerHTML = minsToHoursAndMins(profile.playtime);

            let inputs = document.getElementsByClassName("activity-input");
            let counters = document.getElementsByClassName("amount-counter");
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = 0;
                counters[i].innerHTML = "0";
            }
        }
    });

    // Get SteamId whether it's the URL or just the ID
    let steamId = document.getElementById("steamid-input").value;
    if (isNaN(steamId)) {
        let urlSplit = steamId.split("/").filter(element => element !== "");
        steamId = urlSplit[urlSplit.length - 1];
    }

    xhr.open("GET", "http://127.0.0.1:8000?steamid=" + steamId);

    xhr.send();
}

function minsToHoursAndMins(mins) {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;

    return `${hours} hours ${minutes} minutes`
}

function activityAmountChange(changeAmount, minutes, amountCounterId, numberInputId) {
    let amountSum = parseInt(document.getElementById(amountCounterId).innerHTML);
    let timeCost = changeAmount * minutes;
    let numInputMax = document.getElementById(numberInputId).max;

    if (amountSum + changeAmount >= 0 && profile.playtime - timeCost > 0) {
        if (numInputMax == "" || amountSum + changeAmount <= numInputMax) {
            profile.playtime -= timeCost;
            amountSum += changeAmount;
        }
    }

    document.getElementById(amountCounterId).innerHTML = amountSum;
    document.getElementById(numberInputId).value = amountSum;
    document.getElementById("unspent-playtime").innerHTML = minsToHoursAndMins(profile.playtime);
}

function numInputValueChange(minutes, amountCounterId, numberInputId) {
    let inputValue = parseInt(document.getElementById(numberInputId).value);
    let previousValue = parseInt(document.getElementById(amountCounterId).innerHTML);
    let changeAmount = inputValue - previousValue;

    activityAmountChange(changeAmount, minutes, amountCounterId, numberInputId);
}