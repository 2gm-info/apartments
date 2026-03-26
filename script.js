let slides = [];
let index = 0;
let currentTemp = "--";

async function loadData() {
  const res = await fetch("data.json?nocache=" + new Date().getTime());
  const data = await res.json();

  slides = data.slides;
  document.getElementById("ticker-text").innerText = data.ticker;

  showSlide();
}

function fadeTo(content) {
  const slideEl = document.getElementById("slide");

  slideEl.classList.add("fade-out");

  setTimeout(() => {
    slideEl.innerHTML = `<div class="slide-inner">${content}</div>`;
    slideEl.classList.remove("fade-out");
    slideEl.classList.add("fade-in");
  }, 300);
}

function showSlide() {
  if (!slides.length) return;

  const s = slides[index];

  if (s.type === "weather") {
    loadWeather();
  } else {
    fadeTo(s.content);
  }

  index = (index + 1) % slides.length;
}

async function loadWeather() {
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
}

/* TOPBAR */
function updateTopbar() {
  document.getElementById("top-left").innerText = `Finnsnes ${currentTemp}°C`;
}

/* CLOCK */
function updateClock() {
  const now = new Date();

  document.getElementById("top-center").innerText =
    now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  document.getElementById("top-right").innerText =
    now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/* INTERVALS */
setInterval(showSlide, 10000);
setInterval(loadData, 60000);
setInterval(updateClock, 1000);
setInterval(() => location.reload(), 100000);

/* START */
updateClock();
loadData();
