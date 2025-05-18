// src/components/navigation-menu.js
import { LitElement, html, css } from 'lit';
import { t } from '../localization/index.js';

class NavigationMenu extends LitElement {
  static styles = css`
    :host {
      display: block; 
    }
    nav {
      background-color: #333;
      padding: 1rem;
      margin-bottom: 1rem; 
    }
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 1rem; 
    }
    a {
      text-decoration: none;
      color: white;
      font-weight: bold;
    }
    a:hover, a.active { 
      color: #61dafb; 
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <nav>
        <ul>
          <li><a href="/employees">${t('nav_employee_list')}</a></li>
          <li><a href="/add-employee">${t('nav_add_employee')}</a></li>
        </ul>
      </nav>
    `;
  }
}
customElements.define('navigation-menu', NavigationMenu);