document.addEventListener("DOMContentLoaded", function () {
  const VISIBLE = 3;         
  const AUTO_MS = 5000;      

  const track   = document.getElementById("rec-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dotsBox = document.getElementById("rec-dots");

  let slides = Array.from(track.children);
  const totalSlides = slides.length;

  for (let i = 0; i < totalSlides; i++) {
    let dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.addEventListener("click", function () {
      goToSlide(i);
    });
    dotsBox.appendChild(dot);
  }


  let firstClones = slides.slice(0, VISIBLE).map(function (s) { return s.cloneNode(true); });
  let lastClones  = slides.slice(-VISIBLE).map(function (s) { return s.cloneNode(true); });

  lastClones.forEach(function (c) { track.insertBefore(c, track.firstChild); });
  firstClones.forEach(function (c) { track.appendChild(c); });

  slides = Array.from(track.children);

  let index = VISIBLE + 1;
  let slideWidth = 0;
  let autoPlay = null;

  function calculateWidth() {
    let rect = slides[index].getBoundingClientRect();
    let gap = parseFloat(getComputedStyle(track).gap) || 0;
    slideWidth = rect.width + gap;
  }

  
  function moveSlides(noAnimation) {
    if (noAnimation) {
      track.style.transition = "none";
    }
    track.style.transform = "translateX(" + (-index * slideWidth) + "px)";
    if (noAnimation) {
      track.offsetHeight;
      track.style.transition = "transform 450ms ease";
    }
    updateActiveDot();
  }


  function updateActiveDot() {
    let leftMost = (index - VISIBLE + totalSlides) % totalSlides;
    let center = (leftMost + 1) % totalSlides;
    let dots = Array.from(dotsBox.children);

    dots.forEach(function (dot, i) {
      dot.setAttribute("aria-current", i === center ? "true" : "false");
    });
  }

  
  function nextSlide() {
    index++;
    moveSlides();
  }
  function prevSlide() {
    index--;
    moveSlides();
  }
  function goToSlide(n) {
    index = VISIBLE + ((n - 1 + totalSlides) % totalSlides);
    moveSlides();
  }

  
  track.addEventListener("transitionend", function () {
    if (index >= totalSlides + VISIBLE) {
      index -= totalSlides;
      moveSlides(true);
    } else if (index < VISIBLE) {
      index += totalSlides;
      moveSlides(true);
    }
  });


  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);


  function startAuto() {
    stopAuto();
    autoPlay = setInterval(nextSlide, AUTO_MS);
  }
  function stopAuto() {
    clearInterval(autoPlay);
  }
  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

 
  calculateWidth();
  moveSlides(true);
  startAuto();
  goToSlide(2);

  window.addEventListener("resize", function () {
    calculateWidth();
    moveSlides(true);
  });
});
