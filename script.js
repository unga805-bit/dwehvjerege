let slideIndex = 0;

const slides = document.querySelectorAll(".carousel img");
const slideButtons = document.querySelectorAll("[data-direction]");
const dotsContainer = document.getElementById("carousel-dots");
const hotspots = document.querySelectorAll(".hotspot");

const promoVideo = document.getElementById("promo-video");
const volumeControl = document.getElementById("volume-control");
const muteButton = document.getElementById("mute-button");
const volumeDownButton = document.getElementById("volume-down-button");
const volumeUpButton = document.getElementById("volume-up-button");
const volumeStatus = document.getElementById("volume-status");
const audioHelp = document.getElementById("audio-help");
const volumeButtons = document.querySelectorAll("[data-volume]");

let slideInterval;

function renderDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Anar a la imatge ${index + 1}`);
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === slideIndex);
  });
}

function showSlides() {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === slideIndex);
  });
  updateDots();
}

function changeSlide(n) {
  slideIndex = (slideIndex + n + slides.length) % slides.length;
  showSlides();
}

function goToSlide(index) {
  slideIndex = index;
  showSlides();
}

function startAutoSlide() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    changeSlide(1);
  }, 4000);
}

renderDots();
showSlides();
startAutoSlide();

slideButtons.forEach((button) => {
  button.addEventListener("click", () => {
    changeSlide(Number(button.dataset.direction));
    startAutoSlide();
  });
});

dotsContainer.addEventListener("click", (event) => {
  const dot = event.target.closest(".dot");
  if (!dot) {
    return;
  }

  goToSlide(Number(dot.dataset.index));
  startAutoSlide();
});

promoVideo.volume = 1;
promoVideo.muted = false;

function setVideoVolume(value) {
  const safeVolume = Math.max(0, Math.min(1, value));
  promoVideo.volume = safeVolume;
  promoVideo.muted = safeVolume === 0;
  volumeControl.value = safeVolume;
  updateVolumeStatus();
}

function updateVolumeStatus() {
  const currentVolume = promoVideo.muted ? 0 : Math.round(promoVideo.volume * 100);
  volumeStatus.innerText = `Volum actual: ${currentVolume}%`;
  muteButton.innerText = promoVideo.muted ? "Activar so" : "Silenciar";
  audioHelp.innerText = promoVideo.muted
    ? "El video esta en silenci. Prem 'Activar so' o puja el volum."
    : "Audio actiu. Si no se sent, comprova el volum del navegador o del sistema.";
}

volumeControl.addEventListener("input", () => {
  setVideoVolume(Number(volumeControl.value));
});

muteButton.addEventListener("click", () => {
  promoVideo.muted = !promoVideo.muted;
  updateVolumeStatus();
});

volumeDownButton.addEventListener("click", () => {
  setVideoVolume(promoVideo.volume - 0.1);
});

volumeUpButton.addEventListener("click", () => {
  setVideoVolume(promoVideo.volume + 0.1);
});

volumeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setVideoVolume(Number(button.dataset.volume));
  });
});

promoVideo.addEventListener("volumechange", () => {
  if (!promoVideo.muted) {
    volumeControl.value = promoVideo.volume;
  }
  updateVolumeStatus();
});

updateVolumeStatus();

function showTooltip(element, text) {
  const tooltip = element.querySelector(".tooltip");
  tooltip.innerText = text;
  tooltip.style.display = "block";

  clearTimeout(element.tooltipTimeout);
  element.tooltipTimeout = setTimeout(() => {
    tooltip.style.display = "none";
  }, 2600);
}

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    showTooltip(hotspot, hotspot.dataset.tooltip);
  });
});
