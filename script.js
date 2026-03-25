let slides = [];
let index = 0;

async function loadData() {
  const res = await fetch("data.json?nocache=" + new Date().getTime());
  const data = await res.json();

  slides = data.slides;
  document.getElementById("ticker-text").innerText = data.ticker;

  showSlide();
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
  const res = await fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=69.23&lon=17.98");
  const data = await res.json();

  const temp = data.properties.timeseries[0].data.instant.details.air_temperature;

  document.getElementById("slide").innerHTML = `
    <div>
      <h1>Finnsnes</h1>
      <p style="font-size:2em;">${temp}°C</p>
    </div>
  `;
}

setInterval(showSlide, 10000);
setInterval(loadData, 60000);

loadData();
