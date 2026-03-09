let temps = 0; // temps initial

const affichageTimer = document.getElementById('valeurTimer');

function demarrerTimer() {
    const intervalle = setInterval(function() {
        temps++; // incrémentation

        affichageTimer.innerText = temps; // Actualisation du compteur

        // Arrêt du chrono
        if (temps >= 30) {
            clearInterval(intervalle);

            alert("Temps écoulé ! Votre score final est de : " + scoreTotal);

            boutonsPoints.forEach(function(bouton) {
                bouton.style.pointerEvents = 'none';
            });
        }
    }, 1000);
}

demarrerTimer();