let slides = [];
let index = 0;

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
    document.getElementById("slide").innerHTML = s.content;
  }

  index = (index + 1) % slides.length;
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

    document.getElementById("slide").innerHTML = `
      <div>
        <h1>Finnsnes</h1>
        <p style="font-size:2em;">${temp}°C</p>
      </div>
    `;

    // 🔥 Oppdater topbar temperatur
    document.getElementById("top-right").innerText = temp + "°C";

  } catch (err) {
    console.error("Feil ved lasting av værdata:", err);
  }
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

  document.getElementById("top-center").innerText = `${date} | ${time}`;
}

setInterval(updateClock, 1000);
updateClock();

/* SLIDES */
setInterval(showSlide, 10000);

/* DATA REFRESH */
setInterval(loadData, 60000);

/* FULL PAGE RELOAD (Pi stability) */
setInterval(() => {
  location.reload();
}, 300000);

/* START */
loadData();
