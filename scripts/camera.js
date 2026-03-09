// On sélectionne l'élément vidéo dans la page HTML
const elementVideo = document.getElementById('maCamera');

// On vérifie si le navigateur supporte l'accès aux médias
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    // On demande l'accès à la vidéo (sans l'audio ici)
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(flux) {
            // Si l'utilisateur accepte, on relie le flux à la balise vidéo
            elementVideo.srcObject = flux;
        })
        .catch(function(erreur) {
            // Si l'utilisateur refuse ou s'il n'y a pas de caméra
            console.error("Impossible d'accéder à la caméra : ", erreur);
            alert("Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.");
        });
} else {
    alert("Votre navigateur ne supporte pas l'accès à la caméra.");
}