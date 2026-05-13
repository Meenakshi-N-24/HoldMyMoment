/* ===================== */
/* ELEMENTS */
/* ===================== */

const giga = document.getElementById("giga");
const gigaImg = document.getElementById("giga-img");

const bubble = document.getElementById("bubble");
const scene = document.getElementById("scene");

const roadFlower = document.getElementById("flower-side");
const heldFlower = document.getElementById("held-flower");

const gelatoStall = document.getElementById("gelato-stall");
const heldGelato = document.getElementById("held-gelato");


/* ===================== */
/* VARIABLES */
/* ===================== */

let walkFrame = 1;
let stopped = false;


/* ===================== */
/* WALKING LOOP */
/* alternate walk sprites */
/* ===================== */

setInterval(() => {
  if (!stopped) {
    giga.classList.add("walking");

    if (walkFrame === 1) {
      gigaImg.src = "Assets/walk2.png";
      walkFrame = 2;
    } else {
      gigaImg.src = "Assets/walk1.png";
      walkFrame = 1;
    }
  }
}, 400);


/* ===================== */
/* FLOWER MOMENT */
/* giga stops + points */
/* ===================== */

setTimeout(() => {
  stopped = true;

  giga.classList.remove("walking");
  giga.classList.add("flower-scene");

  /* switch to pointing pose */
  gigaImg.src = "Assets/giga-front.png";

  /* dialogue */
  bubble.innerText = "want?";
  bubble.classList.add("show");

}, 3500);


/* ===================== */
/* GIVE FLOWER */
/* flower enters our hand */
/* ===================== */

/* USER NODS → GIVE FLOWER */

setTimeout(() => {
  /* screen nod */
  scene.classList.add("nod");

  setTimeout(() => {
    scene.classList.remove("nod");
  }, 700);

}, 5200);


setTimeout(() => {
  bubble.classList.remove("show");

  /* roadside flower disappears */
  roadFlower.style.opacity = "0";

  /* held flower appears */
  heldFlower.style.opacity = "1";

}, 6000);

/* ===================== */
/* GELATO SCENE */
/* ===================== */

setTimeout(() => {
  /* stall appears */
  gelatoStall.style.opacity = "1";

}, 8500);


setTimeout(() => {
  stopped = true;

  giga.classList.remove("walking");
  giga.classList.add("flower-scene");

  gigaImg.src = "Assets/giga-front.png";

  bubble.innerText = "gelato?";
  bubble.classList.add("show");

}, 10500);


/* double nod */

setTimeout(() => {
  scene.classList.add("nod");

  setTimeout(() => {
    scene.classList.remove("nod");
  }, 1000);

}, 12000);


/* give gelato */

setTimeout(() => {
  bubble.classList.remove("show");

  gelatoStall.style.opacity = "0";
  heldGelato.style.opacity = "1";

}, 13000);


/* continue walking again */

setTimeout(() => {
  stopped = false;

  giga.classList.remove("flower-scene");
  gigaImg.src = "Assets/walk1.png";

}, 14200);