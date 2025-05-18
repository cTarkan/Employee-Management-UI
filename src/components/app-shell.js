// src/components/app-shell.js
import { LitElement, html, css } from 'lit';
import './navigation-menu.js'; // Navigasyon menüsünü import et
import { initRouter } from '../router/index.js'; // Router başlatma fonksiyonunu import et
import { t } from '../localization/index.js'; // t fonksiyonunu global başlık vb. için kullanabiliriz

class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      line-height: 1.5;
    }
    .app-header {
      background-color: #20232a; /* Biraz daha koyu bir başlık alanı */
      color: white;
      padding: 10px 20px;
      text-align: center;
      margin-bottom: 1rem; /* Navigasyon ile arasında boşluk */
    }
    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .main-content {
      padding: 0 16px 16px; /* Üst padding nav ile sağlandığı için 0 */
      max-width: 960px; /* İçerik için bir max genişlik */
      margin: 0 auto; /* Sayfayı ortala */
    }
  `;

  firstUpdated() {
    // Shadow DOM içindeki router outlet elementini bul
    const outlet = this.renderRoot.querySelector('#router-outlet');
    // Router'ı bu outlet ile başlat
    initRouter(outlet);
  }

  render() {
    return html`
      <header class="app-header">
        <h1>${t('app_title')}</h1>
      </header>
      <navigation-menu></navigation-menu>
      <main id="router-outlet" class="main-content">
        <!-- Router içeriği buraya gelecek -->
      </main>
    `;
  }
}

customElements.define('app-shell', AppShell);