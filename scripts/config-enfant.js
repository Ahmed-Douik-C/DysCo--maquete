(function () {
    'use strict';

    if (typeof updateSessionStatus === 'function') {
        updateSessionStatus();
    }

    // --- Tag toggling ---
    document.querySelectorAll('.tag-chip').forEach(function (chip) {
        if (chip.classList.contains('tag-chip--add')) return;
        chip.addEventListener('click', function () {
            chip.classList.toggle('tag-chip--active');
        });
    });

    // --- Photo preview ---
    var photoInput = document.getElementById('photo-input');
    var photoWrap = document.getElementById('profile-photo');
    var photoImg = document.getElementById('profile-photo-img');
    var btnChangePhoto = document.getElementById('btn-change-photo');

    if (btnChangePhoto && photoInput) {
        btnChangePhoto.addEventListener('click', function () {
            photoInput.click();
        });
    }

    if (photoInput && photoImg) {
        photoInput.addEventListener('change', function () {
            var file = photoInput.files && photoInput.files[0];
            // #region agent log
            fetch('http://127.0.0.1:7293/ingest/a4fb7314-6333-48a0-8abf-1043b4bfe61a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'68d9d5'},body:JSON.stringify({sessionId:'68d9d5',location:'config-enfant.js:change',message:'photo change',data:{hasFile:!!file,type:file&&file.type},timestamp:Date.now(),hypothesisId:'H2'})}).catch(function(){});
            // #endregion
            if (!file || !file.type.startsWith('image/')) return;
            var reader = new FileReader();
            reader.onload = function () {
                photoImg.src = reader.result;
                photoImg.removeAttribute('hidden');
                var placeholder = document.querySelector('.profile-photo-placeholder');
                if (placeholder) placeholder.style.display = 'none';
                // #region agent log
                var placeholderDisplay = placeholder ? window.getComputedStyle(placeholder).display : 'N/A';
                var imgHidden = photoImg.getAttribute('hidden');
                var imgDisplay = window.getComputedStyle(photoImg).display;
                fetch('http://127.0.0.1:7293/ingest/a4fb7314-6333-48a0-8abf-1043b4bfe61a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'68d9d5'},body:JSON.stringify({sessionId:'68d9d5',runId:'post-fix',location:'config-enfant.js:onload',message:'after set img',data:{imgHidden:imgHidden,imgDisplay:imgDisplay,placeholderDisplay:placeholderDisplay},timestamp:Date.now(),hypothesisId:'verify'})}).catch(function(){});
                // #endregion
            };
            reader.readAsDataURL(file);
        });
    }

    // --- Add program modal ---
    var modalAddProgram = document.getElementById('modal-add-program');
    var modalChooseProgram = document.getElementById('modal-choose-program');
    var programAdd = document.getElementById('program-add');
    var modalClose = document.getElementById('modal-close');
    var modalChooseClose = document.getElementById('modal-choose-close');
    var modalChooseExisting = document.getElementById('modal-choose-existing');
    var programsGrid = document.getElementById('programs-grid');

    function openModal(modal) {
        if (modal) {
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    if (programAdd && modalAddProgram) {
        programAdd.addEventListener('click', function () {
            openModal(modalAddProgram);
        });
        programAdd.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(modalAddProgram);
            }
        });
    }

    if (modalClose && modalAddProgram) {
        modalClose.addEventListener('click', function () {
            closeModal(modalAddProgram);
        });
    }

    if (modalChooseExisting && modalChooseProgram && modalAddProgram) {
        modalChooseExisting.addEventListener('click', function () {
            closeModal(modalAddProgram);
            openModal(modalChooseProgram);
        });
    }

    if (modalChooseClose && modalChooseProgram) {
        modalChooseClose.addEventListener('click', function () {
            closeModal(modalChooseProgram);
        });
    }

    modalAddProgram.addEventListener('click', function (e) {
        if (e.target === modalAddProgram) closeModal(modalAddProgram);
    });
    modalChooseProgram.addEventListener('click', function (e) {
        if (e.target === modalChooseProgram) closeModal(modalChooseProgram);
    });

    document.querySelectorAll('#modal-program-chips .modal-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            var name = chip.getAttribute('data-program-name');
            if (!name || !programsGrid) return;
            closeModal(modalChooseProgram);
            // Mock: could append a new program card to programsGrid here
        });
    });

    // --- Save button ---
    var btnSave = document.getElementById('btn-save');
    var inputPrenom = document.getElementById('input-prenom');
    var inputNom = document.getElementById('input-nom');
    var inputDob = document.getElementById('input-dob');

    if (btnSave) {
        btnSave.addEventListener('click', function () {
            var firstName = (inputPrenom && inputPrenom.value) ? inputPrenom.value.trim() : '';
            var lastName = (inputNom && inputNom.value) ? inputNom.value.trim() : '';
            var dob = (inputDob && inputDob.value) ? inputDob.value : '';

            var activeTags = [];
            document.querySelectorAll('.tag-chip.tag-chip--active').forEach(function (chip) {
                var tag = chip.getAttribute('data-tag');
                if (tag) activeTags.push(tag);
            });

            var assignedPrograms = [];
            document.querySelectorAll('.program-card__name').forEach(function (el) {
                if (el.textContent) assignedPrograms.push(el.textContent.trim());
            });

            var profile = {
                firstName: firstName,
                lastName: lastName,
                dob: dob,
                tags: activeTags,
                assignedPrograms: assignedPrograms
            };

            console.log(profile);
            window.location.href = 'select-enfant.html';
        });
    }
})();
