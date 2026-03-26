let slides = [];
let index = 0;
let currentTemp = "--";

/* LOAD DATA */
async function loadData() {
  const res = await fetch("data.json?nocache=" + new Date().getTime());
  const data = await res.json();

  slides = data.slides;
  document.getElementById("ticker-text").innerText = data.ticker;

  showSlide();
}

/* FADE FUNCTION */
function fadeTo(content) {
  const el = document.getElementById("slide");

  // fade ut
  el.style.opacity = 0;

  setTimeout(() => {
    el.innerHTML = `<div class="slide-inner">${content}</div>`;

    // force repaint (kritisk)
    void el.offsetWidth;

    // fade inn
    el.style.opacity = 1;
  }, 400);
}

/* SHOW SLIDE */
function showSlide() {
  if (!slides.length) return;

  const s = slides[index];

  if (s.type === "weather") {
    loadWeatherSlide();
  } else {
    fadeTo(s.content);
  }

  index = (index + 1) % slides.length;
}

/* WEATHER SLIDE */
async function loadWeatherSlide() {
  try {
    const res = await fetch(
      "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=69.23&lon=17.98",
      {
        headers: {
          "User-Agent": "infoscreen/1.0"
        }
      }
    );

    const data = await res.json();
    const temp = data.properties.timeseries[0].data.instant.details.air_temperature;

    currentTemp = temp;

    fadeTo(`
      <h1>Finnsnes</h1>
      <p>${temp}°C</p>
    `);

    updateTopbar();

  } catch (err) {
    console.error("Weather slide error:", err);
  }
}

/* 🔥 WEATHER FOR TOPBAR (uavhengig av slides) */
async function fetchWeatherForTopbar() {
  try {
    const res = await fetch(
      "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=69.23&lon=17.98",
      {
        headers: {
          "User-Agent": "infoscreen/1.0"
        }
      }
    );

    const data = await res.json();
    const temp = data.properties.timeseries[0].data.instant.details.air_temperature;

    currentTemp = temp;
    updateTopbar();

  } catch (err) {
    console.error("Topbar weather error:", err);
  }
}

/* TOPBAR */
function updateTopbar() {
  document.getElementById("top-left").innerText = `Finnsnes ${currentTemp}°C`;
}

/* CLOCK + DATE */
function updateClock() {
  const now = new Date();

  document.getElementById("top-center").innerText =
    now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  document.getElementById("top-right").innerText =
    now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/* INTERVALS */
setInterval(showSlide, 15000);              // slides
setInterval(loadData, 60000);               // data refresh
setInterval(updateClock, 1000);             // klokke
setInterval(fetchWeatherForTopbar, 600000); // temp hvert 10 min
setInterval(() => location.reload(), 300000); // reload 5 min

/* START */
updateClock();
fetchWeatherForTopbar(); // 🔥 viktig
loadData();
