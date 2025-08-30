document.addEventListener("DOMContentLoaded", () => {
  const VISIBLE = 3;                           
  const AUTO_MS = 5000;                        

  const track   = document.getElementById("rec-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dotsBox = document.getElementById("rec-dots");


  let slides = Array.from(track.children);
  const count = slides.length;                 

 
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.addEventListener("click", () => goTo(i));
    dotsBox.appendChild(dot);
  }

  
  const headClones = slides.slice(0, VISIBLE).map(s => s.cloneNode(true));
  const tailClones = slides.slice(-VISIBLE).map(s => s.cloneNode(true));
  tailClones.forEach(c => track.insertBefore(c, track.firstChild));
  headClones.forEach(c => track.appendChild(c));

  slides = Array.from(track.children);

  
  let index = VISIBLE + 1;
  let step = 0;
  let timer = null;

  function computeStep(){
    const rect = slides[index].getBoundingClientRect();
    const gap  = parseFloat(getComputedStyle(track).gap) || 0;
    step = rect.width + gap;
  }

  function setTransform(noAnim=false){
    if (noAnim) track.style.transition = "none";
    track.style.transform = `translateX(-${index * step}px)`;
    if (noAnim) { track.offsetHeight; track.style.transition = "transform 450ms ease"; }
    updateDots();
  }

  function updateDots(){
    const leftmostReal = (index - VISIBLE + count) % count;
    const centerReal   = (leftmostReal + 1) % count; 
    Array.from(dotsBox.children).forEach((d,i)=> {
      d.setAttribute("aria-current", i === centerReal ? "true" : "false");
    });
  }

  function next(){
    index++;
    setTransform();
  }
  function prev(){
    index--;
    setTransform();
  }
  function goTo(n){
    index = VISIBLE + ((n - 1 + count) % count); 
    setTransform();
  }

  
  track.addEventListener("transitionend", () => {
    if (index >= count + VISIBLE) {
      index -= count;
      setTransform(true);
    } else if (index < VISIBLE) {
      index += count;
      setTransform(true);
    }
  });


  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  
  function startAuto(){ stopAuto(); timer = setInterval(next, AUTO_MS); }
  function stopAuto(){ if (timer) clearInterval(timer); }
  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  
  computeStep();
  setTransform(true);
  startAuto();
  goTo(2); 

 
  window.addEventListener("resize", () => {
    computeStep();
    setTransform(true);
  });
});