// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll(".tt-carousel-slide");
const indicators = document.querySelectorAll(".tt-indicator");
const prevBtn = document.getElementById("tt-prevBtn");
const nextBtn = document.getElementById("tt-nextBtn");

function showSlide(index) {
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"));
  indicators.forEach((indicator) => indicator.classList.remove("active"));

  // Show current slide
  slides[index].classList.add("active");
  indicators[index].classList.add("active");
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  showSlide(currentSlide);
}

// Event listeners
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Indicator clicks
indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Button click animations
document.querySelectorAll(".tt-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 150);
  });
});

// Card hover effects
const cards = document.querySelectorAll(".tt-card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});
// Experience Section Data - Keys can be anything, order matters
const experienceData = [
  {
    // First object = First tab
    name: "Living Room",
    image: "images/LivingImage.png",
    markers: [
      {
        x: 10,
        y: 57,
        product: {
          name: "Bedside lamp",
          image:
            "https://cdn4.volusion.store/sjrzx-uggtc/v/vspfiles/photos/LRG4-3018K-ORB-1.jpg",
        },
      },
      {
        x: 58,
        y: 5,
        product: {
          name: "Designer ceiling Lamp",
          image:
            "https://cdn4.volusion.store/sjrzx-uggtc/v/vspfiles/photos/LED-SLDSKR-15-30W-5CCT-BLK-1.jpg",
        },
      },
    ],
  },
  {
    // Second object = Second tab
    name: "Office",
    image: "images/OfficeImage.png",
    markers: [
      {
        x: 58,
        y: 5,
        product: {
          name: "Surface-Mounted LED Ceiling Light",
          image:
            "https://cdn4.volusion.store/sjrzx-uggtc/v/vspfiles/photos/LRG4-3018K-ORB-1.jpg",
        },
      },
      {
        x: 72,
        y: 47,
        product: {
          name: "LED Desk Lamp",
          image:
            "https://cdn4.volusion.store/sjrzx-uggtc/v/vspfiles/photos/LRG4-3018K-ORB-1.jpg",
        },
      },
    ],
  },
  {
    // Third object = Third tab
    name: "Kitchen",
    image: "images/KitchenImage.png",
    markers: [
      {
        x: 43,
        y: 32,
        product: {
          name: "Under Cabinet Lighting",
          image:
            "https://cdn4.volusion.store/sjrzx-uggtc/v/vspfiles/photos/LED-SLDSKR-15-30W-5CCT-BLK-1.jpg",
        },
      },
      {
        x: 70,
        y: 12,
        product: {
          name: "Pendant Kitchen Light",
          image:
            "https://cdn4.volusion.store/sjrzx-uggtc/v/vspfiles/photos/EL415CT5BZ-1.jpg",
        },
      },
    ],
  },
];

// DOM Elements
const experienceImage = document.getElementById("tt-experienceImage");
const markersContainer = document.getElementById("tt-markersContainer");
const experienceTabs = document.querySelectorAll(".tt-experience-tab");
const popupOverlay = document.getElementById("tt-popupOverlay");
const popupClose = document.getElementById("tt-popupClose");
const popupImage = document.getElementById("tt-popupImage");
const popupTitle = document.getElementById("tt-popupTitle");

// State
let currentRoomIndex = 0; // Use index instead of key names
let activeCard = null;
let hideTimeout;
let isMobile = window.innerWidth <= 768;

// Utility function to check if device is mobile
function checkMobile() {
  isMobile = window.innerWidth <= 768;
}

// Initialize tabs with names from experienceData
function initializeTabs() {
  experienceTabs.forEach((tab, index) => {
    if (experienceData[index]) {
      tab.textContent = experienceData[index].name;
    }
  });
}

// Marker creation
function createMarker(marker, index) {
  const markerElement = document.createElement("div");
  markerElement.className = "tt-marker";
  markerElement.style.left = marker.x + "%";
  markerElement.style.top = marker.y + "%";
  markerElement.dataset.index = index;

  // Create product card for desktop
  const productCard = createProductCard(marker.product, index);
  markersContainer.appendChild(productCard);

  // Event listeners based on device type
  if (isMobile) {
    markerElement.addEventListener("click", (e) => {
      e.stopPropagation();
      showMobilePopup(marker.product);
    });
  } else {
    // Desktop hover events
    markerElement.addEventListener("mouseenter", (e) => {
      clearTimeout(hideTimeout);
      showProductCard(productCard, marker, e);
    });

    markerElement.addEventListener("mouseleave", () => {
      hideTimeout = setTimeout(() => {
        hideProductCard(productCard);
      }, 300);
    });

    // Product card hover events
    productCard.addEventListener("mouseenter", () => {
      clearTimeout(hideTimeout);
    });

    productCard.addEventListener("mouseleave", () => {
      hideTimeout = setTimeout(() => {
        hideProductCard(productCard);
      }, 300);
    });
  }

  return markerElement;
}

// Product card creation
function createProductCard(product, index) {
  const productCard = document.createElement("div");
  productCard.className = "tt-product-card";
  productCard.dataset.cardIndex = index;

  productCard.innerHTML = `
    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/240x150?text=Image+Not+Found'" />
    <div class="tt-product-card-content">
      <h3>${product.name}</h3>
    </div>
  `;

  return productCard;
}

// Desktop product card display
function showProductCard(productCard, marker, event) {
  if (isMobile) return;

  if (activeCard && activeCard !== productCard) {
    activeCard.classList.remove("show");
  }

  const rect = markersContainer.getBoundingClientRect();
  const markerRect = event.target.closest(".tt-marker").getBoundingClientRect();

  const x = markerRect.left - rect.left;
  const y = markerRect.top - rect.top;

  let cardX = x + 50;
  let cardY = y - 75;

  // Boundary checks
  if (cardX + 240 > rect.width) {
    cardX = x - 250;
  }
  if (cardY < 0) {
    cardY = y + 50;
  }

  productCard.style.left = cardX + "px";
  productCard.style.top = cardY + "px";
  productCard.classList.add("show");
  activeCard = productCard;
}

function hideProductCard(productCard) {
  if (isMobile) return;
  productCard.classList.remove("show");
  if (activeCard === productCard) {
    activeCard = null;
  }
}

// Mobile popup functions
function showMobilePopup(product) {
  popupImage.src = product.image;
  popupImage.alt = product.name;
  popupTitle.textContent = product.name;
  popupOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function hideMobilePopup() {
  popupOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

// Hide all product cards
function hideAllProductCards() {
  const allCards = markersContainer.querySelectorAll(".tt-product-card");
  allCards.forEach((card) => {
    card.classList.remove("show");
  });
  activeCard = null;
}

// Update experience for room change
function updateExperience(roomIndex) {
  const roomData = experienceData[roomIndex];

  if (!roomData) {
    console.error(`Room data not found for index: ${roomIndex}`);
    return;
  }

  clearTimeout(hideTimeout);
  hideAllProductCards();
  hideMobilePopup();

  experienceImage.style.opacity = "0";

  setTimeout(() => {
    experienceImage.src = roomData.image;
    experienceImage.alt = roomData.name;

    markersContainer.innerHTML = "";

    roomData.markers.forEach((marker, index) => {
      markersContainer.appendChild(createMarker(marker, index));
    });

    experienceImage.style.opacity = "1";
  }, 200);
}

// Event listeners
experienceTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    // Only process if there's corresponding data for this tab index
    if (!experienceData[index]) return;

    experienceTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentRoomIndex = index;
    updateExperience(currentRoomIndex);
  });
});

// Popup close events
popupClose.addEventListener("click", hideMobilePopup);
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) {
    hideMobilePopup();
  }
});

// Escape key to close popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popupOverlay.classList.contains("show")) {
    hideMobilePopup();
  }
});

// Resize handler
window.addEventListener("resize", () => {
  checkMobile();
  hideAllProductCards();
  hideMobilePopup();
});

// Initialize
checkMobile();
initializeTabs();
updateExperience(currentRoomIndex);

class ResponsiveInfiniteFocusCarousel {
  constructor() {
    this.carousel = document.getElementById("tt-carousel");
    this.prevBtn = document.getElementById("tt-prevBtn-testimonial");
    this.nextBtn = document.getElementById("tt-nextBtn-testimonial");
    this.dotsContainer = document.getElementById("tt-dots-container");
    this.progressFill = document.getElementById("tt-progressFill");

    this.testimonials = [
      {
        rating: 5,
        content:
          "I rarely put the time aside to do this but they have been a good supplier and thought it was a chance to express my thanks. I highly recommend these guys. Good luck to you USALIGHT.COM!",
        name: "Herman",
      },
      {
        rating: 5,
        content:
          "I ordered; you shipped; I received all in just 3 days. The lights were just as depicted on the website and all worked perfectly. I will order again in the future. Thanks!!",
        name: "Paul Neuman",
      },
      {
        rating: 5,
        content:
          "Excellent product and accurate description by seller. Two thumbs up! Thanks.",
        name: "Muhammad Siddiqui",
      },
      {
        rating: 5,
        content:
          "I ordered 12 low voltage landscape lights. Had issue with 2 bulbs. Tech support was extremely helpful and shipped out replacements right away. Probably the best customer service experience I've had on the internet",
        name: "Aharui",
      },
      {
        rating: 5,
        content:
          "I had a good experience with this company. I needed some landscaping lights for my back yard pool area, and they had some nifty Maui Lighting fixtures. The shipping was really quick, and they were available to answer a few of the questions I had about making sure I had the right stuff for my project. Good site...I would recommend them over 1000bulbs, for sure.",
        name: "Calvert Williams",
      },
    ];

    this.currentIndex = 0;
    this.totalCards = this.testimonials.length;
    this.autoPlayDuration = 5000; // Increased for better UX
    this.transitionDuration = 600;
    this.isTransitioning = false;
    this.isAutoPlaying = true;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;

    this.init();
  }

  init() {
    this.createCards();
    this.createDots();
    this.updateLayout();
    this.bindEvents();
    this.startAutoPlay();
    this.handleResize();
  }

  createCards() {
    this.carousel.innerHTML = "";

    this.testimonials.forEach((testimonial, index) => {
      const card = document.createElement("div");
      card.className = "tt-testimonial-card";
      card.dataset.index = index;
      card.setAttribute("role", "tabpanel");
      card.setAttribute(
        "aria-label",
        `Testimonial ${index + 1} of ${this.totalCards}`
      );

      const ratingHTML = Array(testimonial.rating)
        .fill()
        .map(
          () => `
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#B2AD9C" viewBox="0 0 24 24" aria-hidden="true">
                                 <path d="M12 0l3.7 7.9 8.3 1.3-6 6.1 1.4 8.7L12 19.9 4.6 24l1.4-8.7-6-6.1 8.3-1.3L12 0z"/>
                             </svg>
                         `
        )
        .join("");

      card.innerHTML = `
                         <div class="tt-rating" aria-label="${testimonial.rating} out of 5 stars">
                             ${ratingHTML}
                         </div>
                         <p class="tt-testimonial-content">"${testimonial.content}"</p>
                         <div class="tt-reviewer-info">
                             <p class="tt-reviewer-name">— ${testimonial.name}</p>
                         </div>
                     `;

      this.carousel.appendChild(card);
    });

    this.allCards = Array.from(
      this.carousel.querySelectorAll(".tt-testimonial-card")
    );
  }

  createDots() {
    this.dotsContainer.innerHTML = "";

    for (let i = 0; i < this.totalCards; i++) {
      const dot = document.createElement("button");
      dot.className = "tt-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      dot.setAttribute(
        "aria-selected",
        i === this.currentIndex ? "true" : "false"
      );

      if (i === this.currentIndex) {
        dot.classList.add("tt-active");
      }

      dot.addEventListener("click", () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }

    this.dots = Array.from(this.dotsContainer.querySelectorAll(".tt-dot"));
  }

  // Pause carousel when any popup/modal is open
  pauseForPopup() {
    this.wasAutoPlaying = this.isAutoPlaying;
    this.pauseAutoPlay();
  }

  // Resume carousel when popup/modal is closed
  resumeFromPopup() {
    if (this.wasAutoPlaying) {
      this.isAutoPlaying = true;
      this.startAutoPlay();
    }
  }

  bindEvents() {
    // Button events
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Mouse events
    this.carousel.addEventListener("mouseenter", () => this.pauseAutoPlay());
    this.carousel.addEventListener("mouseleave", () => this.resumeAutoPlay());

    // Touch events for swipe
    this.carousel.addEventListener(
      "touchstart",
      (e) => this.handleTouchStart(e),
      { passive: true }
    );
    this.carousel.addEventListener("touchend", (e) => this.handleTouchEnd(e), {
      passive: true,
    });

    // Keyboard events
    this.carousel.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Resize handler
    window.addEventListener("resize", () =>
      this.debounce(this.handleResize.bind(this), 250)
    );

    // Visibility change handler
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else if (this.isAutoPlaying) {
        this.resumeAutoPlay();
      }
    });

    // Listen for popup/modal events
    document.addEventListener("popupOpened", () => this.pauseForPopup());
    document.addEventListener("popupClosed", () => this.resumeFromPopup());

    // Listen for generic modal events
    document.addEventListener("modalOpened", () => this.pauseForPopup());
    document.addEventListener("modalClosed", () => this.resumeFromPopup());

    // Check for common popup/modal indicators
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Check for popup/modal classes or styles
            if (
              node.classList?.contains("tt-popup-overlay") ||
              node.classList?.contains("modal") ||
              node.classList?.contains("show") ||
              node.style?.position === "fixed"
            ) {
              this.pauseForPopup();
            }
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (
              node.classList?.contains("tt-popup-overlay") ||
              node.classList?.contains("modal")
            ) {
              this.resumeFromPopup();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    this.popupObserver = observer;
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        this.nextSlide(); // Swipe left - next slide
      } else {
        this.prevSlide(); // Swipe right - previous slide
      }
    }
  }

  handleKeyDown(e) {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        this.prevSlide();
        break;
      case "ArrowRight":
        e.preventDefault();
        this.nextSlide();
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        this.toggleAutoPlay();
        break;
    }
  }

  handleResize() {
    // Recalculate layout on resize
    this.updateLayout();
  }

  debounce(func, wait) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, wait);
  }

  updateDots() {
    this.dots.forEach((dot, i) => {
      const isActive = i === this.currentIndex;
      dot.classList.toggle("tt-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  updateLayout() {
    this.allCards.forEach((card, i) => {
      card.classList.remove("tt-prev", "tt-active", "tt-next");

      if (i === this.currentIndex) {
        card.classList.add("tt-active");
        card.setAttribute("aria-hidden", "false");
      } else if (
        i ===
        (this.currentIndex - 1 + this.totalCards) % this.totalCards
      ) {
        card.classList.add("tt-prev");
        card.setAttribute("aria-hidden", "true");
      } else if (i === (this.currentIndex + 1) % this.totalCards) {
        card.classList.add("tt-next");
        card.setAttribute("aria-hidden", "true");
      } else {
        card.setAttribute("aria-hidden", "true");
      }
    });

    this.updateDots();
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.performSlideTransition((this.currentIndex + 1) % this.totalCards);
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.performSlideTransition(
      (this.currentIndex - 1 + this.totalCards) % this.totalCards
    );
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.performSlideTransition(index);
  }

  performSlideTransition(newIndex) {
    this.isTransitioning = true;
    this.currentIndex = newIndex;
    this.updateLayout();

    setTimeout(() => {
      this.isTransitioning = false;
    }, this.transitionDuration);

    this.restartAutoPlay();
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.progressFill) {
      this.progressFill.style.width = "0%";
    }
  }

  resumeAutoPlay() {
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    this.pauseAutoPlay();
    this.startTime = Date.now();

    this.autoPlayInterval = setInterval(() => {
      if (!this.isTransitioning) {
        this.nextSlide();
        this.startTime = Date.now();
      }
    }, this.autoPlayDuration);

    this.updateProgressBar();
  }

  restartAutoPlay() {
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    }
  }

  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.pauseAutoPlay();
    }
  }

  updateProgressBar() {
    if (!this.progressFill) return;

    this.progressFill.style.width = "0%";

    this.progressInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const percentage = Math.min((elapsed / this.autoPlayDuration) * 100, 100);
      this.progressFill.style.width = percentage + "%";
    }, 50);
  }

  // Public method to destroy the carousel
  destroy() {
    this.pauseAutoPlay();
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    document.removeEventListener("popupOpened", this.pauseForPopup);
    document.removeEventListener("popupClosed", this.resumeFromPopup);
    document.removeEventListener("modalOpened", this.pauseForPopup);
    document.removeEventListener("modalClosed", this.resumeFromPopup);

    if (this.popupObserver) {
      this.popupObserver.disconnect();
    }

    clearTimeout(this.debounceTimer);
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.testimonialCarousel = new ResponsiveInfiniteFocusCarousel();
});

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (window.testimonialCarousel) {
    window.testimonialCarousel.destroy();
  }
});
