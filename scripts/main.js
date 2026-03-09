var AdminMode = sessionStorage.getItem('AdminMode') === 'true';

function setAdminMode(value) {
    AdminMode = value;
    sessionStorage.setItem('AdminMode', String(value));
}

document.addEventListener('DOMContentLoaded', () => {
    // index.html
    const logBtns = document.querySelectorAll('.log-btn');
    if (logBtns.length > 0) {
        logBtns[0].closest('a').addEventListener('click', (e) => {
            e.preventDefault();
            setAdminMode(true);
            window.location.href = logBtns[0].closest('a').href;
        });
        logBtns[1].closest('a').addEventListener('click', (e) => {
            e.preventDefault();
            setAdminMode(false);
            window.location.href = logBtns[1].closest('a').href;
        });
    }

    // select-program.html
    const warning = document.getElementById('warning');
    if (warning) {
        warning.style.display = AdminMode ? 'none' : 'block';
        document.addEventListener('card-selected', (event) => {
            sessionStorage.setItem('selectedProgram', event.detail.programName);
            window.location.href = 'program.html';
        });
    }

    // program.html
    if (window.location.pathname.endsWith('/program.html')) {
        programhtml();
    }
});

async function programhtml() {
        const programTitle = document.querySelector('header h1');
        const programName = sessionStorage.getItem('selectedProgram');
        if (programTitle && programName) {
            programTitle.textContent = 'Programme : ' + programName;
        }

        const exercices = await fetchExercicesAvecPhotos();
        const images = exercices.map(ex => ex.images.principale);
        const imageAleatoire = images[Math.floor(Math.random() * images.length)];
        const img = document.createElement('img');
        img.src = imageAleatoire;
        document.getElementById('image').appendChild(img);
}
