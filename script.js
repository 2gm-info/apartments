let slides = [];
let index = 0;
let currentTemp = "--";

async function loadData() {
  try {
    const res = await fetch("data.json?nocache=" + new Date().getTime());
    const data = await res.json();

    slides = data.slides;
    document.getElementById("ticker-text").innerText = data.ticker;

    showSlide();

  } catch (err) {
    console.error("Feil ved lasting av data.json:", err);
  }
}

function showSlide() {
  if (!slides.length) return;

  const s = slides[index];

  if (s.type === "weather") {
    loadWeather();
  } else {
    document.getElementById("slide").innerHTML = `<div class="slide-inner">${s.content}</div>`;
  }

  index = (index + 1) % slides.length;
}

/* 🔥 HENT VÆR FAST (ikke bare på slide) */
async function fetchWeatherOnly() {
  try {
    const res = await fetch(
      "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=69.23&lon=17.98",
      {
        headers: {
          "User-Agent": "infoscreen/1.0 github-pages"
        }
      }
    );

    const data = await res.json();
    const temp = data.properties.timeseries[0].data.instant.details.air_temperature;

    currentTemp = temp;
    updateTopbar();

  } catch (err) {
    console.error("Feil ved vær (topbar):", err);
  }
}

async function loadWeather() {
  try {
    const res = await fetch(
      "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=69.23&lon=17.98",
      {
        headers: {
          "User-Agent": "infoscreen/1.0 github-pages"
        }
      }
    );

    const data = await res.json();
    const temp = data.properties.timeseries[0].data.instant.details.air_temperature;

    currentTemp = temp;

    document.getElementById("slide").innerHTML = `
      <div>
        <h1>Finnsnes</h1>
        <p style="font-size:2em;">${temp}°C</p>
      </div>
    `;

    updateTopbar();

  } catch (err) {
    console.error("Feil ved lasting av værdata:", err);
  }
}

/* TOPBAR */
function updateTopbar() {
  document.getElementById("top-left").innerText = `Finnsnes ${currentTemp}°C`;
}

/* CLOCK + DATE */
function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const date = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  document.getElementById("top-center").innerText = time;
  document.getElementById("top-right").innerText = date;
}

/* INTERVALS */
setInterval(updateClock, 1000);
setInterval(showSlide, 10000);
setInterval(loadData, 60000);
setInterval(fetchWeatherOnly, 600000); // hvert 10 min
setInterval(() => location.reload(), 100000);

/* START */
updateClock();
fetchWeatherOnly();
loadData();
