// src/components/app-shell.js
import { LitElement, html, css } from 'lit';
import './navigation-menu.js'; 
import { initRouter } from '../router/index.js'; 
import { t } from '../localization/index.js'; 

class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      line-height: 1.5;
    }
    .app-header {
      background-color: #20232a; 
      color: white;
      padding: 10px 20px;
      text-align: center;
      margin-bottom: 1rem; 
    }
    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .main-content {
      padding: 0 16px 16px; 
      max-width: 960px; 
      margin: 0 auto; 
    }
  `;

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#router-outlet');
    initRouter(outlet);
  }

  render() {
    return html`
      <header class="app-header">
        <h1>${t('app_title')}</h1>
      </header>
      <navigation-menu></navigation-menu>
      <main id="router-outlet" class="main-content">
      </main>
    `;
  }
}

customElements.define('app-shell', AppShell);