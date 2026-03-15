class ChildCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['child-name', 'color', 'hide-stats'];
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

  getChildColorValue() {
    const color = (this.getAttribute('color') || 'blue').toLowerCase();
    switch (color) {
      case 'yellow':
        return 'var(--color-yellow)';
      case 'orange':
        return 'var(--color-orange)';
      case 'rose':
      case 'pink':
        return 'var(--color-rose)';
      case 'blue':
      default:
        return 'var(--color-blue)';
    }
  }

  render() {
    const template = document.getElementById('child-card');
    if (!template) return;
  
    const childName = this.getAttribute('child-name') || 'Enfant';
    const childColor = this.getChildColorValue();
    const content = template.content.cloneNode(true);
  
    // Load Material Symbols font inside Shadow DOM
    const fontLink = document.createElement('link');
    fontLink.setAttribute('rel', 'stylesheet');
    fontLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
  
    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('href', '../components/child-card/child-card.css');
  
    const dynamicStyle = document.createElement('style');
    dynamicStyle.textContent = `
      .child-card { --child-color: ${childColor}; }
    `;
  
    // Set text content and ARIA labels
    const nameEl = content.querySelector('.child-name');
    const cardEl = content.querySelector('.child-card');
    const actionsEl = content.querySelector('.actions');
    const hideStats = this.hasAttribute('hide-stats');
  
    if (nameEl) nameEl.textContent = childName;
    if (cardEl) cardEl.setAttribute('aria-label', childName);
    if (actionsEl) {
      actionsEl.setAttribute('aria-label', `Actions ${childName}`);
      if (hideStats) {
        const statsAction = actionsEl.querySelector('[data-action="stats"]');
        if (statsAction) {
          statsAction.remove();
        }
      }
      const isAdmin = sessionStorage.getItem('AdminMode') === 'true';
      if (!isAdmin) {
        const settingsAction = actionsEl.querySelector('[data-action="settings"]');
        if (settingsAction) settingsAction.remove();
      }
    }
  
    // Attach everything to shadow root
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(fontLink);      // <-- font loaded here
    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(dynamicStyle);
    this.shadowRoot.appendChild(content);
  }

  dispatchAction(action) {
    const childName = this.getAttribute('child-name') || 'Enfant';
    this.dispatchEvent(
      new CustomEvent('child-action', {
        detail: { childName, action },
        bubbles: true,
        composed: true
      })
    );
  }

  setupEventListeners() {
    const card = this.shadowRoot?.querySelector('.child-card');
    const playBtn = this.shadowRoot?.querySelector('[data-action="play"]');
    const settingsBtn = this.shadowRoot?.querySelector('[data-action="settings"]');
    const statsBtn = this.shadowRoot?.querySelector('[data-action="stats"]');

    if (card) {
      card.addEventListener('click', () => this.dispatchAction('select'));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.dispatchAction('select');
        }
      });
    }

    const bind = (el, action) => {
      if (!el) return;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.dispatchAction(action);

        if (action === 'stats') {
          const target = this.getAttribute('stats-href') || 'stats.html';
          window.location.href = target;
        }

        if (action === 'play') {
          const target = this.getAttribute('play-href') || 'select-program.html';
          window.location.href = target;
        }

        if (action === 'settings') {
          const explicitHref = this.getAttribute('settings-href');
          const defaultSettingsHref = (window.location.pathname || window.location.href).includes('select-program')
            ? 'config-program.html'
            : 'config-enfant.html';
          window.location.href = explicitHref || defaultSettingsHref;
        }
      });
    };

    bind(playBtn, 'play');
    bind(settingsBtn, 'settings');
    bind(statsBtn, 'stats');
  }
}

customElements.define('child-card', ChildCard);

