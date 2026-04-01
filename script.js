const dialogues = [
  "Are you having fun?",
  "Do you like the flowers?",
  "Is the moon pretty tonight?",
  "I have something for you...",
  "I love you ❤️"
];

let index = 0;

const button = document.getElementById("touch");
const text = document.getElementById("dialogue");
const character = document.getElementById("character");

button.addEventListener("click", () => {
  if (index < dialogues.length) {

    // thinking effect
    text.innerText = "...";

    // character reacts
    character.classList.add("active");

    setTimeout(() => {
      text.innerText = dialogues[index];

      // special styling for last message
      if (index === dialogues.length - 1) {
        text.style.color = "pink";
      } else {
        text.style.color = "white";
      }

      index++;

      // remove reaction
      character.classList.remove("active");

    }, 800);

  } else {
    index = 0;
    text.innerText = "";
  }
});