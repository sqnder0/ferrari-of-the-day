const app = document.querySelector("#app");
const dateEl = document.querySelector("#datepicker");
const dateText = document.querySelector("#date-text");
const dateBtn = document.querySelector("#date-btn");

const MODELS = [
  "Ferrari 250 GTO",
  "Ferrari 275 GTB",
  "Ferrari 365 GTB/4",
  "Dino 246",
  "Ferrari 308 GTB/GTS",
  "Ferrari 288 GTO",
  "Ferrari Testarossa",
  "Ferrari F40",
  "Ferrari 348",
  "Ferrari 512 TR",
  "Ferrari F355",
  "Ferrari F50",
  "Ferrari 550 Maranello",
  "Ferrari 360",
  "Ferrari Enzo",
  "Ferrari F430",
  "Ferrari 599 GTB Fiorano",
  "Ferrari California",
  "Ferrari 458 Italia",
  "LaFerrari",
  "Ferrari 488 GTB",
  "Ferrari Portofino",
  "Ferrari Monza SP1",
  "Ferrari F8 Tributo",
  "Ferrari SF90 Stradale",
  "Ferrari 812 Superfast",
  "Ferrari Roma",
  "Ferrari 296 GTB",
  "Ferrari Daytona SP3",
  "Ferrari Purosangue",
];

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function setDate(date) {
  dateEl.value = toDateString(date);
  dateText.textContent = formatDate(date);
}

dateBtn.addEventListener("click", () => {
  if (dateEl.showPicker) {
    dateEl.showPicker();
  } else {
    dateEl.click();
  }
});

function dayNumber(date) {
  const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utcMidnight / 86400000);
}

function carOfTheDay(date) {
  return MODELS[dayNumber(date) % MODELS.length];
}

function showMessage(text) {
  app.innerHTML = "";
  const p = document.createElement("p");
  p.className = "message";
  p.textContent = text;
  app.appendChild(p);
}

function render(data) {
  app.innerHTML = "";

  const imageSrc = data.originalimage?.source || data.thumbnail?.source;
  if (imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = data.title;
    app.appendChild(img);
  }

  const title = document.createElement("h1");
  title.textContent = data.title;
  app.appendChild(title);

  if (data.description) {
    const sub = document.createElement("p");
    sub.className = "sub";
    sub.textContent = data.description;
    app.appendChild(sub);
  }

  const text = document.createElement("p");
  text.textContent = data.extract;
  app.appendChild(text);

  const link = document.createElement("a");
  link.href = data.content_urls.desktop.page;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Read more on wikipedia";
  app.appendChild(link);
}

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateString(str) {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

async function loadCar(date) {
  showMessage("Loading...");

  try {
    const page = carOfTheDay(date);
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`
    );

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    render(await response.json());
  } catch (error) {
    console.error(error);
    showMessage("Could not load this Ferrari.");
  }
}

setDate(new Date());

dateEl.addEventListener("change", () => {
  if (!dateEl.value) return;

  const date = fromDateString(dateEl.value);

  if (date > new Date()) {
    showMessage("You can't pick a date in the future!");
    return;
  }

  setDate(date);
  loadCar(date);
});

loadCar(new Date());