var AdminMode = sessionStorage.getItem('AdminMode') === 'true';

function setAdminMode(value) {
    AdminMode = value;
    sessionStorage.setItem('AdminMode', String(value));
    if (!value && !sessionStorage.getItem('selectedChild')) {
        sessionStorage.setItem('selectedChild', 'Enfant');
    }
}

function updateSessionStatus() {
    const statusEl = document.getElementById('session-status');
    if (!statusEl) {
        return;
    }

    const mode = AdminMode ? 'Admin' : 'Enfant';
    const selectedChild = sessionStorage.getItem('selectedChild') || 'non selectionne';

    if (AdminMode) {
        statusEl.textContent = `Connecte en tant que : ${mode} (enfant : ${selectedChild})`;
    } else {
        statusEl.textContent = `Connecte en tant que : ${mode} (${selectedChild})`;
    }
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
        document.addEventListener('child-action', (event) => {
            if (event.detail.action === 'play') {
                sessionStorage.setItem('selectedProgram', event.detail.childName);
                window.location.href = 'program.html';
            }
        });
    }

    // program.html
    if (window.location.pathname.endsWith('/program.html')) {
        programhtml();
    }

    // select-enfant.html
    if (window.location.pathname.endsWith('/select-enfant.html')) {
        document.addEventListener('child-action', (event) => {
            if (event?.detail?.childName) {
                sessionStorage.setItem('selectedChild', event.detail.childName);
                updateSessionStatus();
            }
        });
    }

    updateSessionStatus();
});

async function programhtml() {
        const programTitle = document.querySelector('header h1');
        const programName = sessionStorage.getItem('selectedProgram');
        if (programTitle && programName) {
            programTitle.textContent = 'Programme : ' + programName;
        }

        const exercices = await fetchExercicesAvecPhotos();
        const images = exercices.map(ex => ex.images.principale);
        window.programImages = images;
        setRandomProgramImage();
}


