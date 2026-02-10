const SECRET_ANSWER = "06/14/2024";

const lockScreen = document.getElementById("lockScreen");
const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const hintMessage = document.getElementById("hintMessage");
const mainContent = document.getElementById("mainContent");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const questionZone = document.getElementById("questionZone");
const resultMessage = document.getElementById("resultMessage");

let yesScale = 1;
let movedCount = 0;
let answered = false;

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
  const zoneRect = questionZone.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const maxX = zoneRect.width - noRect.width - 8;
  const maxY = zoneRect.height - noRect.height - 8;

  let randomX = Math.random() * maxX;
  let randomY = Math.random() * maxY;

  const yesX = yesBtn.offsetLeft;
  const yesY = yesBtn.offsetTop;

  const xDiff = Math.abs(randomX - yesX);
  const yDiff = Math.abs(randomY - yesY);

  if (xDiff < yesRect.width * 0.9 && yDiff < yesRect.height * 0.9) {
    randomX = Math.min(maxX, randomX + yesRect.width);
  }

  return {
    x: Math.max(8, randomX),
    y: Math.max(8, randomY),
  };
}

function moveNoButton() {
  if (answered) return;

  movedCount += 1;
  const { x, y } = getRandomPosition();
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";

  yesScale = Math.min(2.15, yesScale + 0.11);
  yesBtn.style.transform = `translateY(-50%) scale(${yesScale})`;

  if (movedCount > 6) {
    noBtn.textContent = ["No 🙈", "Still no? 😅", "Are you sure? 👀", "Don't do this 😭"][movedCount % 4];
  }
}

function celebrateYes() {
  if (answered) return;
  answered = true;

  resultMessage.classList.add("success");
  resultMessage.textContent = "YAYYY! Best decision ever 💖 Chitti approves this love story 🐶";
  noBtn.disabled = true;
  noBtn.style.opacity = "0.25";
  noBtn.style.cursor = "not-allowed";
  yesBtn.textContent = "YES!!! 💞";
}

unlockBtn.addEventListener("click", unlockIfCorrect);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockIfCorrect();
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
yesBtn.addEventListener("click", celebrateYes);
