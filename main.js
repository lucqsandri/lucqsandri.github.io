const form = document.getElementById("nameForm");
const input = document.getElementById("nameInput");
const welcomeMessage = document.getElementById("welcomeMessage");
const lastVisitMessage = document.getElementById("lastVisitMessage");

let weather = "loading";

function getDateAndTime() {
    let now = new Date();

    let time = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour12: true
    });

    let date = now.toLocaleDateString("en-US", {
        timeZone: "America/New_York"
    });

    let hour = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        hour12: false
    });

    return {
        time: time,
        date: date,
        hour: Number(hour)
    };
}

function getGreeting(hour) {
    if (hour < 12) {
        return "Good morning";
    } else if (hour < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

function getWeatherDescription(code) {
    if (code == 0) {
        return "clear sky";
    } else if (code == 1) {
        return "mainly clear";
    } else if (code == 2) {
        return "partly cloudy";
    } else if (code == 3) {
        return "overcast";
    } else if (code == 45) {
        return "fog";
    } else if (code == 61) {
        return "rain";
    } else if (code == 71) {
        return "snow";
    } else if (code == 95) {
        return "thunderstorm";
    } else {
        return "unknown";
    }
}

async function fetchWeather() {
    try {
        let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=42.3314&longitude=-83.0458&current_weather=true");
        let data = await response.json();
        weather = getWeatherDescription(data.current_weather.weathercode);
        updateMessage();
    } catch (error) {
        weather = "unavailable";
        updateMessage();
    }
}

function updateMessage() {
    let savedName = localStorage.getItem("userName");

    if (!savedName) {
        savedName = "Guest";
    }

    let current = getDateAndTime();
    let greeting = getGreeting(current.hour);

    welcomeMessage.textContent =
        greeting + " " + savedName + "! It's " + current.time + " EST on " + current.date + ", and it's " + weather + " right now.";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let userName = input.value.trim();

    if (userName !== "") {
        localStorage.setItem("userName", userName);
        updateMessage();
        input.value = "";
    }
});

function showLastVisit() {
    let oldVisit = localStorage.getItem("lastVisit");

    if (oldVisit) {
        lastVisitMessage.textContent = "Btw, you last visited on " + oldVisit + ".";
    } else {
        lastVisitMessage.textContent = "This is your first visit.";
    }
}

function saveLastVisit() {
    let current = getDateAndTime();
    let visitText = current.date + " at " + current.time + " EST";
    localStorage.setItem("lastVisit", visitText);
}

showLastVisit();
updateMessage();
fetchWeather();

setInterval(function() {
    updateMessage();
}, 1000);

saveLastVisit();