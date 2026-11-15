"use strict";

// A manual gallery avoids distracting autoplay and gives the user control.
const studyImages = [
  { src: "../../assets/images/study-desk.jpg", alt: "A person writing study notes beside a laptop and a cup", caption: "Make a little space to focus." },
  { src: "../../assets/images/writing.jpg", alt: "A fountain pen writing on lined paper", caption: "Turn a large assignment into a small next step." },
  { src: "../../assets/images/books.jpg", alt: "A stack of colourful study books", caption: "Keep the work for every course together." }
];
let currentImage = 0;

function showStudyImage(index) {
  currentImage = index;
  const image = document.getElementById("gallery-image");
  image.src = studyImages[index].src;
  image.alt = studyImages[index].alt;
  document.getElementById("gallery-caption").textContent = studyImages[index].caption;
  document.getElementById("gallery-count").textContent = `${index + 1} / ${studyImages.length}`;
  document.querySelectorAll("[data-image]").forEach(function (button) {
    button.setAttribute("aria-pressed", String(Number(button.dataset.image) === index));
  });
}
document.getElementById("next-image").addEventListener("click", function () {
  showStudyImage((currentImage + 1) % studyImages.length);
});
document.querySelectorAll("[data-image]").forEach(function (button) {
  button.addEventListener("click", function () { showStudyImage(Number(button.dataset.image)); });
});
