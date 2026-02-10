const SECRET_ANSWER = "06/14/2024";

const lockScreen = document.getElementById("lockScreen");
const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const hintMessage = document.getElementById("hintMessage");
const mainContent = document.getElementById("mainContent");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const resultMessage = document.getElementById("resultMessage");
const peonyCelebration = document.getElementById("peonyCelebration");
const petalRain = document.getElementById("petalRain");
const closeCelebrationBtn = document.getElementById("closeCelebrationBtn");

const YES_SCALE_STEP = 0.24;
const YES_SCALE_MAX = 5.2;
const VIEWPORT_PADDING = 10;
const YES_SAFE_DISTANCE = 190;

let yesScale = 1;
let movedCount = 0;
let answered = false;

function buildPetalRain() {
  if (!petalRain) return;
  petalRain.innerHTML = "";

  for (let i = 0; i < 34; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal-drop";
    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${10 + Math.random() * 14}px`);
    petal.style.setProperty("--rot", `${Math.random() * 360}deg`);
    petal.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
    petal.style.setProperty("--dur", `${3.6 + Math.random() * 3.2}s`);
    petal.style.setProperty("--delay", `${-Math.random() * 5}s`);
    petalRain.appendChild(petal);
  }
}

function showPeonyCelebration() {
  if (!peonyCelebration) return;

  buildPetalRain();
  peonyCelebration.classList.remove("hidden");
  requestAnimationFrame(() => {
    peonyCelebration.classList.add("show");
  });
}

function resetPage() {
  window.location.reload();
}

function unlockIfCorrect() {
  const typed = passwordInput.value.trim();

  if (typed === SECRET_ANSWER) {
    lockScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    hintMessage.textContent = "";
    passwordInput.value = "";
    return;
  }

  hintMessage.textContent = "Nope! Try the special date in MM/DD/YYYY 💌";
  passwordInput.focus();
}

function getRandomPosition() {
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const maxX = Math.max(VIEWPORT_PADDING, window.innerWidth - noRect.width - VIEWPORT_PADDING);
  const maxY = Math.max(VIEWPORT_PADDING, window.innerHeight - noRect.height - VIEWPORT_PADDING);

  const minX = VIEWPORT_PADDING;
  const minY = VIEWPORT_PADDING;
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;

  let randomX = minX;
  let randomY = minY;
  let foundSafeSpot = false;

  for (let attempt = 0; attempt < 25; attempt += 1) {
    randomX = Math.random() * (maxX - minX) + minX;
    randomY = Math.random() * (maxY - minY) + minY;

    const noCenterX = randomX + noRect.width / 2;
    const noCenterY = randomY + noRect.height / 2;
    const distance = Math.hypot(noCenterX - yesCenterX, noCenterY - yesCenterY);

    if (distance >= YES_SAFE_DISTANCE) {
      foundSafeSpot = true;
      break;
    }
  }

  if (!foundSafeSpot) {
    randomX = Math.min(maxX, yesRect.right + YES_SAFE_DISTANCE * 0.35);
    randomY = Math.max(minY, yesRect.top - YES_SAFE_DISTANCE * 0.25);
  }

  return {
    x: Math.max(minX, Math.min(maxX, randomX)),
    y: Math.max(minY, Math.min(maxY, randomY)),
  };
}

function moveNoButton() {
  if (answered) return;

  if (noBtn.style.position !== "fixed") {
    const current = noBtn.getBoundingClientRect();
    noBtn.style.position = "fixed";
    noBtn.style.left = `${current.left}px`;
    noBtn.style.top = `${current.top}px`;
    noBtn.style.zIndex = "30";
    noBtn.style.transform = "none";
  }

  movedCount += 1;
  const { x, y } = getRandomPosition();
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  yesScale = Math.min(YES_SCALE_MAX, yesScale + YES_SCALE_STEP);
  yesBtn.style.setProperty("--yes-scale", yesScale.toFixed(2));

  if (movedCount > 6) {
    noBtn.textContent = ["No 🙈", "Still no? 😅", "Are you sure? 👀", "Don't do this 😭"][movedCount % 4];
  }
}

function celebrateYes() {
  if (answered) return;
  answered = true;

  resultMessage.classList.add("success");
  resultMessage.textContent = "YAYYY! Best decision ever 💖 Chitti approves, and peonies for you 🌸";
  noBtn.disabled = true;
  noBtn.style.opacity = "0.25";
  noBtn.style.cursor = "not-allowed";
  noBtn.style.display = "none";
  yesBtn.textContent = "YES!!! 💞";

  showPeonyCelebration();
}

unlockBtn.addEventListener("click", unlockIfCorrect);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockIfCorrect();
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
yesBtn.addEventListener("click", celebrateYes);

if (closeCelebrationBtn) {
  closeCelebrationBtn.addEventListener("click", resetPage);
}
