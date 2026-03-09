// 1. Configuration du temps initial (en secondes)
let tempsRestant = 30;
const affichageTimer = document.getElementById('valeurTimer');

// 2. Création de la fonction du chronomètre
function demarrerTimer() {
    // setInterval exécute le code à l'intérieur toutes les 1000 millisecondes (1 seconde)
    const intervalle = setInterval(function() {
        // On enlève 1 au temps restant
        tempsRestant--;

        // On met à jour l'affichage sur la page
        affichageTimer.innerText = tempsRestant;

        // 3. Que se passe-t-il quand le temps est écoulé ?
        if (tempsRestant <= 0) {
            // On arrête le chronomètre
            clearInterval(intervalle);

            // On affiche un message avec le score final
            alert("Temps écoulé ! Votre score final est de : " + scoreTotal);

            // Optionnel : On empêche de continuer à cliquer pour tricher
            boutonsPoints.forEach(function(bouton) {
                // Cette ligne "désactive" les clics en CSS en bloquant les interactions
                bouton.style.pointerEvents = 'none';
            });
        }
    }, 1000);
}

// 4. On lance le timer
demarrerTimer();