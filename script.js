const giga = document.getElementById("giga");
const gigaImg = document.getElementById("giga-img");
const bubble = document.getElementById("bubble");
const heldFlower = document.getElementById("held-flower");

let walkFrame = 1;
let stopped = false;

/* walking animation */

const walkingLoop = setInterval(() => {
  if (!stopped) {
    giga.classList.add("walking");

    if (walkFrame === 1) {
      gigaImg.src = "walk2.png";
      walkFrame = 2;
    } else {
      gigaImg.src = "walk1.png";
      walkFrame = 1;
    }
  }
}, 400);

/* FLOWER SCENE */

setTimeout(() => {
  stopped = true;

  giga.classList.remove("walking");
  giga.classList.add("flower-scene");

  /* switch to pointing pose */
  gigaImg.src = "giga-front.png";

  /* dialogue */
  bubble.innerText = "want?";
  bubble.classList.add("show");

}, 3500);

/* USER NODS → GIVE FLOWER */

setTimeout(() => {
  bubble.classList.remove("show");

  /* show held flower */
  heldFlower.style.opacity = "1";

}, 6000);

/* CONTINUE WALKING */

setTimeout(() => {
  stopped = false;

  giga.classList.remove("flower-scene");
  gigaImg.src = "walk1.png";

}, 7000);