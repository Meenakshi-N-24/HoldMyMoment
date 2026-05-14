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

const clawMachine = document.getElementById("claw-machine");
const heldPlush = document.getElementById("held-plush");


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
/* CONTINUE WALKING AFTER FLOWER */
/* ===================== */

setTimeout(() => {
  stopped = false;

  giga.classList.remove("flower-scene");
  gigaImg.src = "Assets/walk1.png";

}, 7200);


/* ===================== */
/* WALK BEFORE GELATO */
/* ===================== */

setTimeout(() => {
  /* gelato stall appears while walking */
  gelatoStall.style.opacity = "1";

}, 9800);

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

/* ===================== */
/* CLAW MACHINE SCENE */
/* ===================== */

setTimeout(() => {
  clawMachine.style.opacity = "1";

}, 17000);


setTimeout(() => {
  stopped = true;

  giga.classList.remove("walking");
  giga.classList.add("flower-scene");

  gigaImg.src = "Assets/giga-front.png";

  bubble.innerText = "want one?";
  bubble.classList.add("show");

}, 18800);


/* double nod */

setTimeout(() => {
  scene.classList.add("nod");

  setTimeout(() => {
    scene.classList.remove("nod");
  }, 1000);

}, 20200);


/* give plush */

setTimeout(() => {
  bubble.classList.remove("show");

  clawMachine.style.opacity = "0";
  heldPlush.style.opacity = "1";

}, 21200);


/* continue walking */

setTimeout(() => {
  stopped = false;

  giga.classList.remove("flower-scene");
  gigaImg.src = "Assets/walk1.png";

}, 22400);

/* ===================== */
/* FINAL SCENE */
/* I love you :3 */
/* ===================== */

setTimeout(() => {
  /* stop walking */
  stopped = true;

  giga.classList.remove("walking");
  giga.classList.add("flower-scene");

  /* final facing pose */
  gigaImg.src = "Assets/giga-front.png";

  /* little pause before confession */
}, 24000);


/* confession appears after pause */

setTimeout(() => {
  bubble.innerText = "I love you :3";
  bubble.classList.add("show");

}, 26000);


/* soft fade ending */

setTimeout(() => {
  document.body.style.transition = "2s ease";
  document.body.style.opacity = "0";

}, 30000);