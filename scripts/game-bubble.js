// --- Configuration ---
const GAME_DURATION = 30; // Durée de la partie en secondes
const BUBBLE_SPAWN_INTERVAL = 1000; // Créer une bulle toutes les secondes (1000ms)
const BUBBLE_SIZE_MIN = 40; // Taille min en pixels
const BUBBLE_SIZE_MAX = 80; // Taille max en pixels
const BUBBLE_FALL_DURATION_MIN = 3; // Temps de chute min en secondes
const BUBBLE_FALL_DURATION_MAX = 6; // Temps de chute max en secondes

// --- Éléments HTML ---
const elementVideo = document.getElementById('camera');
const bubbleContainer = document.getElementById('bubble-container');
const affichageScore = document.getElementById('valeurScore');
const affichageTimer = document.getElementById('valeurTimer');
const encouragement = document.getElementById('encouragement');

// --- État du Jeu ---
let scoreTotal = 0;
let tempsRestant = GAME_DURATION;
let gameTimerId = null;
let spawnIntervalId = null;

const encouragementMessages = [
    'Wow !', 'Bravo !', 'Bien joué !', 'Super !', 'Top !', 'Génial !'
];

// --- 1. Gestion de la Caméra (Inchangé) ---
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

// --- 2. Logique du Jeu de Bulles ---

function createBubble() {
    if (!bubbleContainer) return;

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    // Taille aléatoire
    const size = Math.random() * (BUBBLE_SIZE_MAX - BUBBLE_SIZE_MIN) + BUBBLE_SIZE_MIN;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Position horizontale aléatoire (en % pour rester dans le cadre)
    const posX = Math.random() * 90; // Entre 0% et 90% pour ne pas coller au bord droit
    bubble.style.left = `${posX}%`;

    // Durée de chute aléatoire (vitesse)
    const fallDuration = Math.random() * (BUBBLE_FALL_DURATION_MAX - BUBBLE_FALL_DURATION_MIN) + BUBBLE_FALL_DURATION_MIN;
    bubble.style.animationDuration = `${fallDuration}s`;

    // Gestion du clic pour éclater la bulle
    bubble.addEventListener('click', function() {
        popBubble(bubble);
    });

    bubbleContainer.appendChild(bubble);

    // Supprimer la bulle si elle arrive en bas sans être cliquée
    setTimeout(() => {
        if (bubble.parentNode === bubbleContainer) {
            bubbleContainer.removeChild(bubble);
        }
    }, fallDuration * 1000);
}

function popBubble(bubble) {
    // Éviter de cliquer plusieurs fois sur la même bulle
    if (bubble.classList.contains('pop')) return;

    bubble.classList.add('pop');
    scoreTotal += 1; // 1 point par bulle
    affichageScore.innerText = scoreTotal;

    showEncouragement();

    // Supprimer l'élément après l'animation d'éclatement
    setTimeout(() => {
        if (bubble.parentNode === bubbleContainer) {
            bubbleContainer.removeChild(bubble);
        }
    }, 300); // Correspond à la durée de .bubble.pop dans le CSS
}

function showEncouragement() {
    if (!encouragement) return;
    const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    encouragement.textContent = message;
    encouragement.classList.remove('encouragement-pop');
    void encouragement.offsetWidth; // Trigger reflow
    encouragement.classList.add('encouragement-pop');

    // Effacer le message après un court instant
    setTimeout(() => {
        encouragement.textContent = '';
        encouragement.classList.remove('encouragement-pop');
    }, 1000);
}

// --- 3. Gestion du Chronomètre et de la Partie ---

function updateTimerDisplay() {
    affichageTimer.innerText = `${tempsRestant}s`;
}

function startGame() {
    scoreTotal = 0;
    tempsRestant = GAME_DURATION;
    affichageScore.innerText = '0';
    updateTimerDisplay();

    // Lancer la génération de bulles
    spawnIntervalId = setInterval(createBubble, BUBBLE_SPAWN_INTERVAL);

    // Lancer le compte à rebours
    gameTimerId = setInterval(() => {
        tempsRestant--;
        updateTimerDisplay();

        if (tempsRestant <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameTimerId);
    clearInterval(spawnIntervalId);

    // Nettoyer les bulles restantes
    if (bubbleContainer) {
        bubbleContainer.innerHTML = '';
    }

    // Sauvegarder le score pour la page de fin
    sessionStorage.setItem('lastScore', String(scoreTotal));

    // Rediriger vers la page de sélection ou afficher un score final
    // Pour cet exemple, on peut juste afficher une alerte
    alert(`Partie terminée ! Score final : ${scoreTotal}`);

    // Optionnel : rediriger
    // window.location.href = 'select-program.html';
}

// Démarrer le jeu au chargement de la page
window.addEventListener('load', startGame);