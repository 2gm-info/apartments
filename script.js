let slides = [];
let index = 0;

async function loadData() {
  try {
    const res = await fetch("data.json?nocache=" + new Date().getTime());
    const data = await res.json();

    slides = data.slides;
    document.getElementById("ticker-text").innerText = data.ticker;

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

  } catch (err) {
    console.error("Feil ved lasting av værdata:", err);
  }
}

// Bytt slide hvert 10 sek
setInterval(showSlide, 10000);

// Oppdater JSON hvert minutt
setInterval(loadData, 60000);

// FULL refresh hvert 5 min (viktig for Pi)
setInterval(() => {
  location.reload();
}, 300000);

// Start
loadData();
setTimeout(showSlide, 1000);
