const colorBank = {
  brown: { name: "חום שוקולד", hex: "#6b442f", family: "brown" },
  camel: { name: "קאמל", hex: "#b47a48", family: "brown" },
  olive: { name: "זית", hex: "#5c6b3f", family: "green" },
  forest: { name: "ירוק יער", hex: "#244f3a", family: "green" },
  burgundy: { name: "בורדו", hex: "#7b2634", family: "burgundy" },
  denim: { name: "כחול ג׳ינס", hex: "#315f87", family: "blue" },
  navy: { name: "נייבי", hex: "#172a45", family: "blue" },
  cream: { name: "שמנת", hex: "#f3e2c4", family: "white" },
  beige: { name: "בז׳ חם", hex: "#d4b58d", family: "beige" },
  blush: { name: "ורוד מעושן", hex: "#c98791", family: "pink" },
  black: { name: "שחור", hex: "#191615", family: "black" },
  red: { name: "אדום עמוק", hex: "#b12b28", family: "red" },
  mustard: { name: "חרדל", hex: "#c7972f", family: "yellow" },
  plum: { name: "שזיף", hex: "#56334f", family: "purple" },
};

// מנטה וטורקיז בחוץ. כל צבע נעליים אחר יכול להיכנס לרוטציה.
const excludedFamilies = ["mint", "turquoise"];

const palettes = [
  ["brown", "olive", "cream", "burgundy"],
  ["denim", "camel", "forest", "cream"],
  ["navy", "mustard", "beige", "burgundy"],
  ["plum", "olive", "camel", "cream"],
  ["forest", "blush", "brown", "beige"],
  ["denim", "burgundy", "cream", "mustard"],
  ["black", "camel", "olive", "cream"],
  ["brown", "denim", "blush", "forest"],
];

const shoeOptions = [
  { color: "חום", family: "brown", weight: 6 },
  { color: "קאמל", family: "brown", weight: 5 },
  { color: "בורדו", family: "burgundy", weight: 5 },
  { color: "כחול", family: "blue", weight: 5 },
  { color: "נייבי", family: "blue", weight: 4 },
  { color: "ירוק", family: "green", weight: 5 },
  { color: "זית", family: "green", weight: 4 },
  { color: "ורוד", family: "pink", weight: 4 },
  { color: "סגול/שזיף", family: "purple", weight: 4 },
  { color: "חרדל", family: "yellow", weight: 4 },
  { color: "אפור", family: "gray", weight: 4 },
  { color: "כסף", family: "silver", weight: 3 },
  { color: "זהב", family: "gold", weight: 3 },
  { color: "שחור", family: "black", weight: 3 },
  { color: "לבן", family: "white", weight: 3 },
  { color: "בז׳", family: "beige", weight: 3 },
  { color: "אדום", family: "red", weight: 1 },
];

const accessoryOptions = [
  { color: "זהב/ברונזה", family: "metal", weight: 7 },
  { color: "חום", family: "brown", weight: 6 },
  { color: "בורדו", family: "burgundy", weight: 5 },
  { color: "ירוק", family: "green", weight: 4 },
  { color: "כחול", family: "blue", weight: 4 },
  { color: "ורוד", family: "pink", weight: 2 },
  { color: "אדום", family: "red", weight: 1 },
];

const rules = {
  red: {
    accessoryEveryLooks: 6,
    shoesEveryLooks: 10,
    avoidIfRecentlyUsed: true,
    role: "accentOnly",
  },
  shoes: {
    requireVariety: true,
    avoidRepeatingLastColor: true,
    allColorsAllowedExcept: ["mint", "turquoise"],
    limitStrongColors: ["red"],
    avoidSafeColorOveruse: ["black", "white", "beige"],
  },
  excludedColorFamilies: excludedFamilies,
};

const state = {
  mode: "random",
  currentLook: null,
  history: JSON.parse(localStorage.getItem("styleHistory") || "[]"),
  saved: JSON.parse(localStorage.getItem("savedLooks") || "[]"),
};

const $ = (selector) => document.querySelector(selector);
const paletteEl = $("#palette");
const reasonEl = $("#reason");
const mainItemEl = $("#mainItem");
const shoesItemEl = $("#shoesItem");
const accessoryItemEl = $("#accessoryItem");
const savedLooksEl = $("#savedLooks");

function saveState() {
  localStorage.setItem("styleHistory", JSON.stringify(state.history.slice(-30)));
  localStorage.setItem("savedLooks", JSON.stringify(state.saved));
}

function weightedPick(options) {
  const total = options.reduce((sum, item) => sum + item.weight, 0);
  let rand = Math.random() * total;
  for (const item of options) {
    rand -= item.weight;
    if (rand <= 0) return item;
  }
  return options[0];
}

function countRecent(predicate, take = 10) {
  return state.history.slice(-take).filter(predicate).length;
}

function shouldBlockRed(type) {
  const gap = type === "shoes" ? rules.red.shoesEveryLooks : rules.red.accessoryEveryLooks;
  return countRecent((look) => look[type]?.family === "red", gap) > 0;
}

function pickShoes() {
  const lastShoesFamily = state.history.at(-1)?.shoes?.family;
  const recentSafe = countRecent((look) => ["black", "white", "beige"].includes(look.shoes?.family), 5);
  const recentFamilies = state.history.slice(-8).map((look) => look.shoes?.family).filter(Boolean);

  let options = shoeOptions.filter((shoe) => {
    if (excludedFamilies.includes(shoe.family)) return false;
    if (shoe.family === lastShoesFamily) return false;
    if (shoe.family === "red" && shouldBlockRed("shoes")) return false;
    if (["black", "white", "beige"].includes(shoe.family) && recentSafe >= 2) return false;
    return true;
  });

  // גיוון אמיתי: כל הצבעים יכולים להופיע, חוץ ממנטה וטורקיז.
  // צבע שחזר לאחרונה מקבל פחות משקל, וצבע שלא הופיע לאחרונה מקבל עדיפות קלה.
  options = options.map((shoe) => {
    const recentCount = recentFamilies.filter((family) => family === shoe.family).length;
    const varietyBoost = recentCount === 0 ? 3 : 0;
    const repeatPenalty = recentCount * 2;
    return { ...shoe, weight: Math.max(1, shoe.weight + varietyBoost - repeatPenalty) };
  });

  return weightedPick(options.length ? options : shoeOptions.filter((shoe) => shoe.family !== lastShoesFamily && !excludedFamilies.includes(shoe.family) && shoe.family !== "red"));
}

function pickAccessory() {
  const options = accessoryOptions.filter((item) => {
    if (excludedFamilies.includes(item.family)) return false;
    if (item.family === "red" && shouldBlockRed("accessory")) return false;
    return true;
  });
  return weightedPick(options.length ? options : accessoryOptions.filter((item) => item.family !== "red"));
}

function pickPalette() {
  const base = $("#baseColor").value;
  let pool = palettes.filter((palette) => palette.every((key) => !excludedFamilies.includes(colorBank[key].family)));

  if (state.mode === "hasColor") {
    pool = pool.filter((palette) => palette.some((key) => colorBank[key].family === base || key === base));
  }

  return pool[Math.floor(Math.random() * pool.length)] || palettes[0];
}

function createLook() {
  const paletteKeys = pickPalette();
  const palette = paletteKeys.map((key) => colorBank[key]);
  const main = palette[0];
  const shoes = pickShoes();
  const accessory = pickAccessory();

  return {
    palette,
    main,
    shoes,
    accessory,
    createdAt: new Date().toISOString(),
  };
}

function renderLook(look) {
  paletteEl.innerHTML = look.palette.map((color) => `
    <div class="swatch" style="background:${color.hex}">
      <span>${color.name}</span>
    </div>
  `).join("");

  mainItemEl.textContent = look.main.name;
  shoesItemEl.textContent = look.shoes.color;
  accessoryItemEl.textContent = look.accessory.color;

  const redNote = [look.shoes.family, look.accessory.family].includes("red")
    ? "האדום פה רק כנגיעה, לא בתפקיד ראשי. ככה מתנהגים יפה."
    : "אין מנטה/טורקיז, אין אדום משתלט, ויש נעליים שמחליפות אווירה באמת.";

  reasonEl.textContent = redNote;
}

function renderSaved() {
  if (!state.saved.length) {
    savedLooksEl.className = "saved-list empty";
    savedLooksEl.textContent = "עוד אין שמורים. מחכים ללוק שצועק שימי.";
    return;
  }

  savedLooksEl.className = "saved-list";
  savedLooksEl.innerHTML = state.saved.map((look) => `
    <div class="saved-look">
      <strong>${look.main.name}</strong> · נעליים ${look.shoes.color} · אביזר ${look.accessory.color}
    </div>
  `).join("");
}

function nextLook(markChosen = false) {
  const look = createLook();
  state.currentLook = look;
  state.history.push({ shoes: look.shoes, accessory: look.accessory, chosen: markChosen });
  saveState();
  renderLook(look);
}

document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.mode = btn.dataset.mode;
    $("#colorInputCard").classList.toggle("hidden", state.mode !== "hasColor");
    nextLook();
  });
});

$("#baseColor").addEventListener("change", () => nextLook());
$("#nextBtn").addEventListener("click", () => nextLook());
$("#chosenBtn").addEventListener("click", () => {
  if (!state.currentLook) nextLook(true);
  reasonEl.textContent = "נרשם שבחרת משהו. האפליקציה תלמד לאט לאט מה עובד לך.";
});
$("#saveBtn").addEventListener("click", () => {
  if (!state.currentLook) return;
  state.saved.unshift(state.currentLook);
  state.saved = state.saved.slice(0, 20);
  saveState();
  renderSaved();
});
$("#resetHistoryBtn").addEventListener("click", () => {
  state.history = [];
  saveState();
  reasonEl.textContent = "איפסתי היסטוריית צבעים. האדום לא קיבל חנינה, רק התחלה חדשה.";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

renderSaved();
nextLook();
