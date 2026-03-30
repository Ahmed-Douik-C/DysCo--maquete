// Camera
const elementVideo = document.getElementById('camera');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(flux) {
            elementVideo.srcObject = flux;
        })
        .catch(function(erreur) {
            console.error("Impossible d'accéder à la caméra : ", erreur);
            alert("Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.");
        });
} else {
    alert("Votre navigateur ne supporte pas l'accès à la caméra.");
}

// Score
let scoreTotal = 0;
let moveCount = 0;
const maxMoves = 20;
let timerId = null;

const affichageScore = document.getElementById('valeurScore');
const boutonsPoints = document.querySelectorAll('.liste-score li');
const encouragement = document.getElementById('encouragement');
const moveCounter = document.getElementById('move-counter');
const finalScore = document.getElementById('final-score');
const encouragementMessages = [
    'Wow !',
    'Bravo !',
    'Bien joue !',
    'Super !',
    'Top !',
    'Continue !',
    'Genial !',
    'Encore !'
];

function showEncouragement() {
    if (!encouragement) {
        return;
    }
    const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    encouragement.textContent = message;
    encouragement.classList.remove('encouragement-pop');
    void encouragement.offsetWidth;
    encouragement.classList.add('encouragement-pop');
}

function updateMoveCounter() {
    if (moveCounter) {
        moveCounter.textContent = `${moveCount}/${maxMoves}`;
    }
}

function finishGame() {
    sessionStorage.setItem('lastScore', String(scoreTotal));
    sessionStorage.setItem('lastMoves', String(moveCount));
    sessionStorage.setItem('lastTimeSeconds', String(elapsedSeconds));
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (finalScore) {
        finalScore.textContent = `Bravo ! Score : ${scoreTotal}`;
    }
}
boutonsPoints.forEach((bouton) => {
  bouton.addEventListener('click', function () {
    if (moveCount >= maxMoves) return;

    if (roundState !== "awaitingScore") return;

    const pointsAjoutes = parseInt(this.innerText, 10);
    scoreTotal += pointsAjoutes;
    affichageScore.innerText = scoreTotal;

    moveCount += 1;
    updateMoveCounter();
    showEncouragement();

    if (moveCount >= maxMoves) {
      finishGame();
      return;
    }

    startRound();
  });
});
updateMoveCounter();


// Chrono
let EXO_DURATION = 15; 
let temps = EXO_DURATION;
let elapsedSeconds = 0;
const affichageTimer = document.getElementById('valeurTimer');
let roundState = "running";
let roundEnded = false;

function startRound() {
  roundEnded = false;
  roundState = "running";

  hideCaptured(); 
  setRandomProgramImage();
  demarrerTimer();
}

function endRound() {
  if (roundEnded) return;
  roundEnded = true;
  roundState = "awaitingScore";

  endTimer();
  captureAndStore();
}

function renderTimerValue(totalSeconds) {
    if (!affichageTimer) {
        return;
    }
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const secondes = safeSeconds % 60;
    if (minutes < 1) {
        affichageTimer.innerText = `${secondes}s`;
    } else {
        affichageTimer.innerText = `${minutes}min${secondes}s`;
    }
}

function demarrerTimer() {
  if (!affichageTimer) return;

  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  temps = EXO_DURATION;
  renderTimerValue(temps);

  timerId = setInterval(() => {
    elapsedSeconds += 1;
    temps -= 1;
    renderTimerValue(temps);

    if (temps <= 0) {
      endRound();
    }
  }, 1000);
}

function endTimer() {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
}
demarrerTimer();
function renderProgramImage(imageUrl) {
    const container = document.getElementById('image');
    if (!container) {
        return;
    }

    let img = container.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        container.innerHTML = '';
        container.appendChild(img);
    }
    img.src = imageUrl;
}

function setRandomProgramImage() {
    const images = window.programImages;
    if (!Array.isArray(images) || images.length === 0) {
        return;
    }
    const imageAleatoire = images[Math.floor(Math.random() * images.length)];
    renderProgramImage(imageAleatoire);
}

const video = document.getElementById('camera');
const btnCapture = document.getElementById('btn-capture');
const overlayImg = document.getElementById('camera-overlay');

if (btnCapture) {
  btnCapture.addEventListener('click', endRound);
}

function showCaptured(dataUrl) {
  if (!overlayImg || !dataUrl) return;
  overlayImg.src = dataUrl;
  overlayImg.style.display = 'block';
}

function captureAndStore() {
  if (!video || video.readyState < 2 || video.videoWidth === 0) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  sessionStorage.setItem('lastPhotoDataUrl', dataUrl);
  showCaptured(dataUrl);
}

function hideCaptured() {
  if (!overlayImg) return;
  overlayImg.style.display = 'none';
  overlayImg.src = '';
  sessionStorage.removeItem('lastPhotoDataUrl'); // optionnel
}
