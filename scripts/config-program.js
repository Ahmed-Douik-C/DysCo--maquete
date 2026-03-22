// ── Mock program profiles ──────────────────────────────────
const programProfiles = {
    'Coordination - Difficile': {
        name: 'Coordination - Difficile',
        coverImage: '../resources/movement_011.jpg',
        tags: ['Dyspraxie', 'Troubles moteurs'],
        movements: [
            { name: 'Saut groupé', image: null },
            { name: 'Équilibre unipodal', image: null },
            { name: 'Rotation du tronc', image: null }
        ]
    },
    'Coordination - Facile': {
        name: 'Coordination - Facile',
        coverImage: '../resources/movement_012.jpg',
        tags: ['Dyspraxie'],
        movements: [
            { name: 'Marche talon-pointe', image: null },
            { name: 'Claquement de mains', image: null }
        ]
    },
    'Motricité - Lent': {
        name: 'Motricité - Lent',
        coverImage: '../resources/movement_013.jpg',
        tags: ['Troubles moteurs', 'Dysgraphie'],
        movements: [
            { name: 'Ramper', image: null },
            { name: 'Rotation du tronc', image: null }
        ]
    },
    'Motricité fine - Écriture': {
        name: 'Motricité fine - Écriture',
        coverImage: '../resources/movement_014.jpg',
        tags: ['Dysgraphie', 'Dyslexie'],
        movements: [
            { name: 'Claquement de mains', image: null },
            { name: 'Lancer de balle', image: null }
        ]
    },
    'Motricité - Rapide': {
        name: 'Motricité - Rapide',
        coverImage: '../resources/movement_015.jpg',
        tags: ['TDAH', 'Troubles de l\'attention'],
        movements: [
            { name: 'Saut à pieds joints', image: null },
            { name: 'Saut groupé', image: null },
            { name: 'Lancer de balle', image: null }
        ]
    },
    'Attention - Mémoire': {
        name: 'Attention - Mémoire',
        coverImage: '../resources/movement_016.jpg',
        tags: ['TDAH', 'Troubles de l\'attention'],
        movements: [
            { name: 'Équilibre unipodal', image: null }
        ]
    },
    'Spatialisation - Gauche/Droite': {
        name: 'Spatialisation - Gauche/Droite',
        coverImage: '../resources/movement_017.jpg',
        tags: ['Dyspraxie', 'Dyslexie'],
        movements: [
            { name: 'Rotation du tronc', image: null },
            { name: 'Marche talon-pointe', image: null }
        ]
    },
    'Spatialisation - Orientation': {
        name: 'Spatialisation - Orientation',
        coverImage: '../resources/movement_018.jpg',
        tags: ['Dyspraxie'],
        movements: [
            { name: 'Ramper', image: null },
            { name: 'Saut groupé', image: null }
        ]
    }
};

// ── Program data structure ───────────────────────────────────
let program = {
    name: "",
    tags: [],
    movements: []
};

// Library of movements (seeded with default values)
const defaultLibrary = [
    "Saut groupé",
    "Équilibre unipodal",
    "Lancer de balle",
    "Ramper",
    "Marche talon-pointe",
    "Claquement de mains",
    "Rotation du tronc",
    "Saut à pieds joints"
];

let library = defaultLibrary.map((name, index) => ({
    id: `lib-${index}`,
    name: name,
    image: null
}));

// Drag state
let draggedMovementIndex = null;
let draggedFromLibrary = false;
let insertAfterIndex = null;

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
    loadProgramFromStorage();
    renderSequence();
    renderLibrary();

    // Update header title with program name
    const selectedProgram = sessionStorage.getItem('selectedProgram');
    if (selectedProgram) {
        const titleEl = document.querySelector('header h1');
        if (titleEl) titleEl.textContent = 'Configuration : ' + selectedProgram;
    }
});

// ── Event listeners setup ─────────────────────────────────────
function initializeEventListeners() {
    // Program name input
    document.getElementById("input-program-name").addEventListener("input", (e) => {
        program.name = e.target.value;
    });

    // Cover image button
    document.getElementById("btn-change-cover").addEventListener("click", () => {
        document.getElementById("cover-input").click();
    });

    document.getElementById("cover-input").addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.getElementById("cover-image-img");
                img.src = event.target.result;
                img.removeAttribute("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Tag chip toggle
    document.querySelectorAll(".tag-chip:not(.tag-chip--add)").forEach((chip) => {
        chip.addEventListener("click", () => {
            const tag = chip.dataset.tag;
            if (program.tags.includes(tag)) {
                program.tags = program.tags.filter((t) => t !== tag);
            } else {
                program.tags.push(tag);
            }
            updateTagChips();
        });
    });

    // Add movement strip
    document.getElementById("add-movement-strip").addEventListener("click", () => {
        document.getElementById("library-scroll").scrollIntoView({ behavior: "smooth" });
    });

    // Modal controls for new movement
    document.getElementById("modal-new-movement-close").addEventListener("click", closeNewMovementModal);
    document.getElementById("modal-new-movement-cancel").addEventListener("click", closeNewMovementModal);
    document.getElementById("modal-new-movement-confirm").addEventListener("click", confirmNewMovement);

    // Save button
    document.getElementById("btn-save").addEventListener("click", saveProgram);

    // Close modal on overlay click
    document.getElementById("modal-new-movement").addEventListener("click", (e) => {
        if (e.target.id === "modal-new-movement") {
            closeNewMovementModal();
        }
    });
}

// ── Render sequence ───────────────────────────────────────────
function renderSequence() {
    const list = document.getElementById("sequence-list");
    list.innerHTML = "";

    program.movements.forEach((movement, index) => {
        const strip = document.createElement("div");
        strip.className = "movement-strip";
        strip.draggable = true;
        strip.dataset.index = index;

        // Drag handle
        const dragHandle = document.createElement("div");
        dragHandle.className = "movement-drag-handle";
        dragHandle.innerHTML = '<span class="material-symbols-outlined">drag_indicator</span>';

        // Thumbnail
        const thumb = document.createElement("div");
        thumb.className = "movement-thumb";
        if (movement.image) {
            const img = document.createElement("img");
            img.src = movement.image;
            img.alt = movement.name;
            thumb.appendChild(img);
        } else {
            const placeholder = document.createElement("span");
            placeholder.className = "material-symbols-outlined movement-thumb-placeholder";
            placeholder.textContent = "directions_run";
            thumb.appendChild(placeholder);
        }

        // Name (contenteditable)
        const name = document.createElement("div");
        name.className = "movement-name";
        name.contentEditable = "false";
        name.textContent = movement.name;
        name.addEventListener("click", () => {
            name.contentEditable = "true";
            name.focus();
        });
        name.addEventListener("blur", () => {
            program.movements[index].name = name.textContent.trim();
            name.contentEditable = "false";
        });
        name.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                name.blur();
            }
        });

        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.className = "movement-remove";
        removeBtn.type = "button";
        removeBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
        removeBtn.addEventListener("click", () => {
            program.movements.splice(index, 1);
            renderSequence();
            renderLibrary();
        });

        strip.appendChild(dragHandle);
        strip.appendChild(thumb);
        strip.appendChild(name);
        strip.appendChild(removeBtn);

        // Drag events
        strip.addEventListener("dragstart", onMovementDragStart);
        strip.addEventListener("dragend", onMovementDragEnd);

        list.appendChild(strip);
    });

    // Setup drop zones on list
    list.addEventListener("dragover", onSequenceDragOver);
    list.addEventListener("drop", onSequenceDrop);
    list.addEventListener("dragleave", onSequenceDragLeave);
}

// ── Render library ────────────────────────────────────────────
function renderLibrary() {
    const scroll = document.getElementById("library-scroll");
    scroll.innerHTML = "";

    library.forEach((item) => {
        const card = document.createElement("div");
        card.className = "library-card";
        card.draggable = true;
        card.dataset.id = item.id;

        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            card.appendChild(img);
        } else {
            const content = document.createElement("div");
            content.className = "library-card-content";

            const icon = document.createElement("span");
            icon.className = "material-symbols-outlined library-card-icon";
            icon.textContent = "directions_run";

            const nameEl = document.createElement("div");
            nameEl.className = "library-card-name";
            nameEl.textContent = item.name;

            content.appendChild(icon);
            content.appendChild(nameEl);
            card.appendChild(content);
        }

        card.addEventListener("dragstart", onLibraryDragStart);
        scroll.appendChild(card);
    });

    // Add "New movement" card
    const addCard = document.createElement("div");
    addCard.className = "library-card library-card--add";
    addCard.innerHTML = `
        <div class="library-card-content">
            <span class="material-symbols-outlined library-card-icon">add</span>
        </div>
    `;
    addCard.addEventListener("click", openNewMovementModal);
    scroll.appendChild(addCard);
}

// ── Drag events for sequence reordering ───────────────────────
function onMovementDragStart(e) {
    draggedMovementIndex = parseInt(e.currentTarget.dataset.index);
    draggedFromLibrary = false;
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedMovementIndex);
}

function onMovementDragEnd(e) {
    e.currentTarget.classList.remove("dragging");
    document.querySelectorAll(".movement-strip").forEach((s) => {
        s.classList.remove("drag-over-after");
    });
    draggedMovementIndex = null;
    insertAfterIndex = null;
}

function onSequenceDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedFromLibrary ? "copy" : "move";

    const list = e.currentTarget;
    const strips = Array.from(document.querySelectorAll(".movement-strip"));

    if (strips.length === 0) {
        list.classList.add("drag-over", "drag-over--empty");
        insertAfterIndex = -1;
        return;
    }

    list.classList.add("drag-over");
    list.classList.remove("drag-over--empty");

    const rect = list.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    let closestIndex = -1;
    let closestDistance = Infinity;

    strips.forEach((strip, idx) => {
        const stripRect = strip.getBoundingClientRect();
        const stripCenter = stripRect.top + stripRect.height / 2 - rect.top;
        const distance = Math.abs(offsetY - stripCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = offsetY > stripCenter ? idx : idx - 1;
        }
    });

    strips.forEach((s) => s.classList.remove("drag-over-after"));
    if (closestIndex >= 0 && closestIndex < strips.length) {
        strips[closestIndex].classList.add("drag-over-after");
        insertAfterIndex = closestIndex;
    } else if (closestIndex === -1 && strips.length > 0) {
        strips[strips.length - 1].classList.add("drag-over-after");
        insertAfterIndex = strips.length - 1;
    } else {
        insertAfterIndex = -1;
    }
}

function onSequenceDragLeave(e) {
    if (e.currentTarget === e.target) {
        document.querySelectorAll(".movement-strip").forEach((s) => {
            s.classList.remove("drag-over-after");
        });
        e.currentTarget.classList.remove("drag-over", "drag-over--empty");
    }
}

function onSequenceDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const list = e.currentTarget;
    list.classList.remove("drag-over", "drag-over--empty");

    document.querySelectorAll(".movement-strip").forEach((s) => {
        s.classList.remove("drag-over-after");
    });

    if (draggedFromLibrary) {
        const libraryId = e.dataTransfer.getData("text/plain");
        const libraryItem = library.find((item) => item.id === libraryId);
        if (libraryItem) {
            const newMovement = {
                name: libraryItem.name,
                image: libraryItem.image
            };

            if (insertAfterIndex >= 0) {
                program.movements.splice(insertAfterIndex + 1, 0, newMovement);
            } else {
                program.movements.push(newMovement);
            }
        }
    } else if (draggedMovementIndex !== null) {
        if (insertAfterIndex >= 0 && insertAfterIndex !== draggedMovementIndex) {
            const movement = program.movements[draggedMovementIndex];
            program.movements.splice(draggedMovementIndex, 1);

            const newIndex =
                insertAfterIndex > draggedMovementIndex ? insertAfterIndex : insertAfterIndex + 1;
            program.movements.splice(newIndex, 0, movement);
        }
    }

    draggedMovementIndex = null;
    draggedFromLibrary = false;
    insertAfterIndex = null;
    renderSequence();
    renderLibrary();
}

// ── Drag events for library ───────────────────────────────────
function onLibraryDragStart(e) {
    draggedFromLibrary = true;
    draggedMovementIndex = null;
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.id);
}

// ── Tag chips ─────────────────────────────────────────────────
function updateTagChips() {
    document.querySelectorAll(".tag-chip:not(.tag-chip--add)").forEach((chip) => {
        const tag = chip.dataset.tag;
        if (program.tags.includes(tag)) {
            chip.classList.add("tag-chip--active");
        } else {
            chip.classList.remove("tag-chip--active");
        }
    });
}

// ── Modal for new movement ────────────────────────────────────
function openNewMovementModal() {
    const modal = document.getElementById("modal-new-movement");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("input-movement-name").focus();
    document.getElementById("input-movement-name").value = "";
    document.getElementById("input-movement-image").value = "";
}

function closeNewMovementModal() {
    document.getElementById("modal-new-movement").setAttribute("aria-hidden", "true");
}

function confirmNewMovement() {
    const name = document.getElementById("input-movement-name").value.trim();
    if (!name) return;

    const imageInput = document.getElementById("input-movement-image");
    const file = imageInput.files?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newMovement = {
                name: name,
                image: e.target.result
            };
            library.push({
                id: `lib-${Date.now()}`,
                name: name,
                image: e.target.result
            });
            program.movements.push(newMovement);
            renderSequence();
            renderLibrary();
            closeNewMovementModal();
        };
        reader.readAsDataURL(file);
    } else {
        const newMovement = {
            name: name,
            image: null
        };
        library.push({
            id: `lib-${Date.now()}`,
            name: name,
            image: null
        });
        program.movements.push(newMovement);
        renderSequence();
        renderLibrary();
        closeNewMovementModal();
    }
}

// ── Storage ───────────────────────────────────────────────────
function loadProgramFromStorage() {
    // Check for selected program from mock profiles first
    const selectedProgram = sessionStorage.getItem('selectedProgram');
    if (selectedProgram && programProfiles[selectedProgram]) {
        const profile = programProfiles[selectedProgram];
        program.name = profile.name;
        program.tags = [...profile.tags];
        program.movements = profile.movements.map(m => ({ ...m }));

        document.getElementById("input-program-name").value = program.name;

        // Set cover image
        if (profile.coverImage) {
            const img = document.getElementById("cover-image-img");
            img.src = profile.coverImage;
            img.removeAttribute("hidden");
        }

        updateTagChips();
        renderSequence();
        renderLibrary();
        return;
    }

    // Fallback: load from sessionStorage
    const saved = sessionStorage.getItem("program");
    if (saved) {
        program = JSON.parse(saved);
        document.getElementById("input-program-name").value = program.name;
        updateTagChips();
        renderSequence();
        renderLibrary();

        // Load cover image if exists
        if (program.coverImage) {
            const img = document.getElementById("cover-image-img");
            img.src = program.coverImage;
            img.removeAttribute("hidden");
        }
    }
}

function saveProgram() {
    program.name = document.getElementById("input-program-name").value.trim();

    // Get cover image
    const coverImg = document.getElementById("cover-image-img");
    if (!coverImg.hasAttribute("hidden")) {
        program.coverImage = coverImg.src;
    }

    console.log("Program saved:", program);
    sessionStorage.setItem("program", JSON.stringify(program));

    // Redirect to select-program.html
    window.location.href = "select-program.html";
}
