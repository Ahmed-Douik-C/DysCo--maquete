// ── Données ───────────────────────────────────────────────
// Remplace ce tableau par tes données depuis la BDD.
// Chaque entrée : { id: string, url: string, name: string }
// url peut être une vraie URL ou une couleur CSS pour les placeholders.

let images = [
  { id: "p1", url: null, name: "Image 1" },
  { id: "p2", url: null, name: "Image 2" },
  { id: "p3", url: null, name: "Image 3" },
  { id: "p4", url: null, name: "Image 4" },
  { id: "p5", url: null, name: "Image 5" },
  { id: "p6", url: null, name: "Image 6" },
];

let slots = [
  { id: "s1", label: "", imgId: null },
  { id: "s2", label: "", imgId: null },
  { id: "s3", label: "", imgId: null },
];

let dragImgId = null;
let nextId = 100;

// ── Rendu galerie ─────────────────────────────────────────
function renderGallery() {
  const usedIds = slots.map((s) => s.imgId).filter(Boolean);
  const gallery = document.getElementById("gallery");

  gallery.innerHTML = images
    .map((img, i) => {
      const isUsed = usedIds.includes(img.id);
      const inner = img.url
        ? `<img src="${img.url}" alt="${img.name}" loading="lazy">`
        : `<span class="placeholder-label">${img.name}</span>`;

      return `
      <div
        class="gallery-item ${isUsed ? "used" : ""}"
        id="gitem-${img.id}"
        draggable="true"
        ondragstart="onDragStart(event, '${img.id}')"
        onclick="onGalleryClick('${img.id}')"
        title="${img.name}"
      >
        ${inner}
        <div class="badge">✓</div>
      </div>
    `;
    })
    .join("");
}

// ── Rendu liste ───────────────────────────────────────────
function renderList() {
  const panel = document.getElementById("list-panel");

  panel.innerHTML = slots
    .map((slot, i) => {
      const img = slot.imgId ? images.find((im) => im.id === slot.imgId) : null;

      let thumbnail;
      if (img) {
        thumbnail = img.url
          ? `<div class="slot-thumb"><img src="${img.url}" alt="${img.name}"></div>`
          : `<div class="slot-thumb placeholder-thumb"><span>${img.name}</span></div>`;
      } else {
        thumbnail = `
        <div class="slot-empty-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>`;
      }

      const sublabel = img ? img.name : "Glisse une image ici";

      return `
      <div
        class="list-slot ${img ? "filled" : ""}"
        id="slot-${slot.id}"
        ondragover="onDragOver(event, '${slot.id}')"
        ondragleave="onDragLeave('${slot.id}')"
        ondrop="onDrop(event, '${slot.id}')"
      >
        ${thumbnail}
        <div class="slot-info">
          <div class="slot-label">
            <input
              type="text"
              placeholder="Nom de l'élément ${i + 1}…"
              value="${slot.label}"
              oninput="onLabelInput(event, '${slot.id}')"
              onclick="event.stopPropagation()"
            >
          </div>
          <div class="slot-sublabel">${sublabel}</div>
        </div>
        <button class="slot-remove" onclick="removeFromSlot(event, '${slot.id}')" title="Retirer l'image">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="9" y2="9"/>
            <line x1="9" y1="1" x2="1" y2="9"/>
          </svg>
        </button>
      </div>
    `;
    })
    .join("");
}

function render() {
  renderGallery();
  renderList();
}

// ── Drag & Drop ───────────────────────────────────────────
function onDragStart(e, imgId) {
  dragImgId = imgId;
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData("text/plain", imgId);
}

function onDragOver(e, slotId) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  document.getElementById("slot-" + slotId).classList.add("drag-over");
}

function onDragLeave(slotId) {
  document.getElementById("slot-" + slotId).classList.remove("drag-over");
}

function onDrop(e, slotId) {
  e.preventDefault();
  document.getElementById("slot-" + slotId).classList.remove("drag-over");

  const id = e.dataTransfer.getData("text/plain") || dragImgId;
  if (!id) return;

  const slot = slots.find((s) => s.id === slotId);
  if (slot) {
    slot.imgId = id;
    dragImgId = null;
    render();
  }
}

// ── Clic galerie → premier slot vide ─────────────────────
function onGalleryClick(imgId) {
  const emptySlot = slots.find((s) => !s.imgId);
  if (emptySlot) {
    emptySlot.imgId = imgId;
    render();
  }
}

// ── Retirer une image d'un slot ───────────────────────────
function removeFromSlot(e, slotId) {
  e.stopPropagation();
  const slot = slots.find((s) => s.id === slotId);
  if (slot) {
    slot.imgId = null;
    render();
  }
}

function onLabelInput(e, slotId) {
  const slot = slots.find((s) => s.id === slotId);
  if (slot) slot.label = e.target.value;
}

function addSlot() {
  slots.push({ id: "s" + nextId++, label: "", imgId: null });
  renderList();
}

function addGallerySlot() {
  const n = images.length + 1;
  images.push({ id: "p" + nextId++, url: null, name: "Image " + n });
  renderGallery();
}

// ── Init ──────────────────────────────────────────────────
render();

// ── Brancher la BDD ───────────────────────────────────────
// async function loadImagesFromDB() {
//   const response = await fetch('/api/images');
//   const data = await response.json();
//   images = data.map(item => ({ id: String(item.id), url: item.url, name: item.name }));
//   render();
// }
// loadImagesFromDB();
