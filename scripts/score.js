// 1. On initialise la variable qui va stocker le score
let scoreTotal = 0;

// 2. On sélectionne les éléments HTML dont on a besoin
const affichageScore = document.getElementById('valeurScore');
const boutonsPoints = document.querySelectorAll('.liste-score li');

// 3. On ajoute un "écouteur de clic" sur chaque numéro de la liste
boutonsPoints.forEach(function(bouton) {
    bouton.addEventListener('click', function() {
        // On récupère le texte du bouton cliqué (ex: "3") et on le convertit en nombre (entier)
        const pointsAjoutes = parseInt(this.innerText);

        // On additionne ces points au score total
        scoreTotal += pointsAjoutes;

        // On met à jour l'affichage sur la page Web
        affichageScore.innerText = scoreTotal;
    });
});