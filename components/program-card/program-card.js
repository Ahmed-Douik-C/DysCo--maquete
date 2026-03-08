class ProgramCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['program-name', 'image', 'border-color', 'border-width'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
        this.render();
        this.setupEventListeners();
    }
  }

  render() {
    const template = document.getElementById('program-card');
    if (!template) return;

    const programName = this.getAttribute('program-name') || 'Programme';
    const image = this.getAttribute('image') || '';
    const borderColor = this.getAttribute('border-color') || '#000000';
    const borderWidth = this.getAttribute('border-width') || '2px';

    const content = template.content.cloneNode(true);

    const linkStyle = document.createElement('link');
    linkStyle.setAttribute('rel', 'stylesheet');
    linkStyle.setAttribute('href', '../components/program-card/program-card.css');

    const dynamicStyle = document.createElement('style');
    dynamicStyle.textContent = `
      .card {
        border: ${borderWidth} solid ${borderColor};
      }
    `;

    const card = content.querySelector('.card');
    const paragraph = content.querySelector('p');

    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = programName;
      card.appendChild(img);
    }

    paragraph.textContent = programName;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(linkStyle);
    this.shadowRoot.appendChild(dynamicStyle);
    this.shadowRoot.appendChild(content);
  }

  setupEventListeners() {
    const pgm = this.shadowRoot.querySelector('.pgm');
    if (pgm) {
      pgm.addEventListener('click', () => {
        const programName = this.getAttribute('program-name') || 'Programme';
                const event = new CustomEvent('program-selected', {
          detail: {
            programName: programName,
            image: this.getAttribute('image') || ''
          },
          bubbles: true,
          composed: true
        });
        
        this.dispatchEvent(event);
      });
    }
  }
}

customElements.define('program-card', ProgramCard);
