document.getElementById("settings").addEventListener("click", () => {
    document.getElementById("settingsPopup").classList.add("show");
    playSound("menu-sound.mp3");
});
  
document.querySelector(".cross").addEventListener("click", () => {
    document.getElementById("settingsPopup").classList.remove("show");
    playSound("close-sound.mp3");
});
  
document.querySelector(".btn.controls").addEventListener("click", () => {
    document.getElementById("settingsPopup").classList.add("aside");
    document.getElementById("controlsPopup").classList.add("show");
    playSound("menu-sound.mp3");
});


document.querySelector("#controlsPopup .btn.cancel").addEventListener("click", () => {
    document.getElementById("settingsPopup").classList.remove("aside");
    document.getElementById("controlsPopup").classList.remove("show");
    playSound("close-sound.mp3");
});
document.querySelector("#controlsPopup .btn.save").addEventListener("click", () => {
    document.getElementById("settingsPopup").classList.remove("aside");
    document.getElementById("controlsPopup").classList.remove("show");
    playSound("save-sound.mp3");
});

function handleButtonHover(event) {
    const target = event.target.closest(".btn");
    if (!target) return;
    const isCancel = target.classList.contains("cancel");
    const imgSrc = `public/img/icons/${isCancel ? "cancel-btn" : "save-btn"}${isCancel ? "-red" : "-green"}.svg`;
    target.querySelector("img").src = imgSrc;
}
function handleButtonMouseOut(event) {
    const target = event.target.closest(".btn");
    if (!target) return;
    const originalImgSrc = `public/img/icons/${target.classList.contains("cancel") ? "cancel-btn" : "save-btn"}.svg`;
    target.querySelector("img").src = originalImgSrc;
  }

document.querySelector("#controlsPopup .save-cancel").addEventListener("mouseover", handleButtonHover);
document.querySelector("#controlsPopup .save-cancel").addEventListener("mouseout", handleButtonMouseOut);

let volumeLevel = 3;
const menuSound = document.getElementById("menu-audio");

function updateVolumeBars() {
  const volumeBars = document.querySelectorAll(".volume-bar");
  volumeBars.forEach((bar, index) => {
    if (index < volumeLevel) {
      bar.style.backgroundColor = "#fff";
    } else {
      bar.style.backgroundColor = "#686868"; 
    }
  });
  

  menuSound.volume = volumeLevel / 5;
}

function increaseVolume() {
  if (volumeLevel < 5) {
    volumeLevel++;
    updateVolumeBars();
    playSound("save-sound.mp3");
  }
}

function decreaseVolume() {
  if (volumeLevel > 0) {
    volumeLevel--;
    updateVolumeBars();
    playSound("close-sound.mp3");
  }
}

document.getElementById("plus").addEventListener("click", increaseVolume);
document.getElementById("minus").addEventListener("click", decreaseVolume);

function playSound(soundFile) {
    try {
        const menuAudio = document.getElementById("menu-audio");
        
        menuAudio.pause();
        menuAudio.currentTime = 0;
        
        menuAudio.src = "./public/sound/"+soundFile;
        menuAudio.play();
    } catch (error) {
        // console.log();
    }
}

const musicOn = document.querySelector(".toggle-music.on");
const musicOff = document.querySelector(".toggle-music.off");
const music = document.getElementById("music");
music.loop = true;
musicOn.addEventListener("click", function() {
    music.play();
});

musicOff.addEventListener("click", function() {
    music.pause();
});



  
const handOverlay = document.querySelector('.hand-overlay');
const handOverlayWidth = handOverlay.offsetWidth;
const handOverlayHeight = handOverlay.offsetHeight;
let currentScale = 1.3;
let isZoomedIn;

function addEventListeners() {
    document.addEventListener('mousemove', mouseMoveHandler);
    handOverlay.addEventListener('click', clickHandler);
}
function removeEventListeners() {
    document.removeEventListener('mousemove', mouseMoveHandler);
    handOverlay.removeEventListener('click', clickHandler);
}
function mouseMoveHandler(e) {
    const mouseX = Math.min(Math.max(e.clientX - (handOverlayWidth / 2), -500), -140);
    const mouseY = e.clientY - (handOverlayHeight / 2);
    handOverlay.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${currentScale})`;
}

function clickHandler() {
    if (!isZoomedIn) {
        if (currentScale < 2) {
            currentScale += 0.3;
        } else {
            isZoomedIn = true;
        }
    } else {
        currentScale = 1.3;
        isZoomedIn = false;
    }
    handOverlay.style.transform = `translate(${handOverlay.style.transform.match(/translate\(([^)]+)\) scale\(([^)]+)\)/)[1]}px, ${handOverlay.style.transform.match(/translate\(([^)]+)\) scale\(([^)]+)\)/)[2]}px) scale(${currentScale})`;
}

document.querySelector(".btn.tutorial").addEventListener("click", () => {
    document.querySelector("main").classList.add("move");
    document.body.classList.add("tutorial-open");
    document.querySelector(".scanlines-overlay").classList.add("move");
    document.querySelector(".tutorial-screen").classList.add("show");
    handOverlay.querySelector("img").src="public/img/tutorial-pages/tutorial-page-1.png";
    document.querySelector(".nextPage").style.display="flex";
    playSound("page-turn.mp3");
    addEventListeners();
});

document.querySelector(".return").addEventListener("click", () => {
    document.querySelector("main").classList.remove("move");
    document.body.classList.remove("tutorial-open");
    document.querySelector(".scanlines-overlay").classList.remove("move");
    document.querySelector(".tutorial-screen").classList.remove("show");
    playSound("menu-sound.mp3");
    removeEventListeners(); // Remove event listeners when tutorial is closed
});



