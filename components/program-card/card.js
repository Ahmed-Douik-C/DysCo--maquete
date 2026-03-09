class ProgramCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['program-name', 'image', 'border-color', 'border-width'];
  }

  async connectedCallback() {
    await this.render();
    this.setupEventListeners();
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected) return;
    if (oldValue !== newValue) {
        await this.render();
        this.setupEventListeners();
    }
  }

  async render() {
    const programName = this.getAttribute('program-name') || 'Programme';
    const image = this.getAttribute('image') || '';
    const borderColor = this.getAttribute('border-color') || '#000000';
    const borderWidth = this.getAttribute('border-width') || '2px';

    const response = await fetch('../components/program-card/card.html');
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const content = wrapper.firstElementChild;

    const linkStyle = document.createElement('link');
    linkStyle.setAttribute('rel', 'stylesheet');
    linkStyle.setAttribute('href', '../components/program-card/card.css');

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
                const event = new CustomEvent('card-selected', {
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

customElements.define('custom-card', ProgramCard);