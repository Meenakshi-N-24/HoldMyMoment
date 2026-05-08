const giga = document.getElementById("giga");
const bubble = document.getElementById("bubble");
const leftArm = document.getElementById("left-arm");
const targetRing = document.getElementById("target-ring");
const heldFlower = document.getElementById("held-flower");

let walking = false;
let flowerTriggered = false;
let waitingForChoice = false;
let flowerAccepted = false;

/* Start walking */

function startWalk() {
  if (walking) return;

  walking = true;
  giga.classList.add("walking");
}

/* Stop walking */

function stopWalk() {
  walking = false;
  giga.classList.remove("walking");
}

/* Flower Scene */

function flowerScene() {
  if (flowerTriggered) return;

  flowerTriggered = true;
  waitingForChoice = true;

  stopWalk();

  giga.style.transform =
    "translateX(-50%) rotate(-8deg)";

  giga.classList.add("talking");

  leftArm.style.opacity = "1";

  bubble.innerText = "want?";
  bubble.style.opacity = "1";
}

/* Accept Flower */

function acceptFlower() {
  if (!waitingForChoice || flowerAccepted) return;

  flowerAccepted = true;
  waitingForChoice = false;

  bubble.innerText = "for you";
  heldFlower.style.opacity = "1";

  setTimeout(() => {
    bubble.style.opacity = "0";
    leftArm.style.opacity = "0";

    giga.classList.remove("talking");
    giga.style.transform =
      "translateX(-50%)";

  }, 2500);
}

/* Hover trigger */

targetRing.addEventListener("mouseenter", () => {
  startWalk();

  setTimeout(() => {
    flowerScene();
  }, 2500);
});

/* SPACE = yes */

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    acceptFlower();
  }
});