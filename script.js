const slides = document.querySelectorAll(".carousel-slide");
const indicators = document.querySelectorAll(".indicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    indicators[i].classList.toggle("active", i === index);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

indicators.forEach((indicator, i) => {
  indicator.addEventListener("click", () => {
    currentIndex = i;
    showSlide(currentIndex);
  });
});

// Auto-advance
setInterval(nextSlide, 5000);
