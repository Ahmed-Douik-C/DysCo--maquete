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
    sessionStorage.setItem('lastTimeSeconds', String(temps));
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (finalScore) {
        finalScore.textContent = `Bravo ! Score : ${scoreTotal}`;
    }
}

boutonsPoints.forEach(function(bouton) {
    bouton.addEventListener('click', function() {
        if (moveCount >= maxMoves) {
            return;
        }
        const pointsAjoutes = parseInt(this.innerText);

        scoreTotal += pointsAjoutes;
        affichageScore.innerText = scoreTotal;
        moveCount += 1;
        updateMoveCounter();

        if (typeof window.setRandomProgramImage === 'function') {
            window.setRandomProgramImage();
        }

        showEncouragement();

        if (moveCount >= maxMoves) {
            finishGame();
        }
    });
});

updateMoveCounter();

// Chrono
let temps = 0;

const affichageTimer = document.getElementById('valeurTimer');

function demarrerTimer() {
    timerId = setInterval(function() {
        temps++;

        const minutes = Math.floor(temps / 60);
        const secondes = temps % 60;
        if (minutes < 1) {
            affichageTimer.innerText = `${secondes}s`;
        } else {
            affichageTimer.innerText = `${minutes}min${secondes}s`;
        }
    }, 1000);
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