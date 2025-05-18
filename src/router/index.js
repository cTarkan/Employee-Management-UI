// src/router/index.js
import { Router } from '@vaadin/router';

export const initRouter = (outletElement) => {
  const router = new Router(outletElement);
  router.setRoutes([
    {
      path: '/',
      redirect: '/employees',
    },
    {
      path: '/employees',
      component: 'employee-list-page',
      action: async () => {
        await import('../pages/employee-list-page.js');
      },
    },
    {
      path: '/add-employee',
      component: 'employee-form-page',
      action: async (context, commands) => {
        await import('../pages/employee-form-page.js');
      },
    },
    {
      path: '/employees/edit/:id',
      component: 'employee-form-page',
      action: async (context, commands) => {
        await import('../pages/employee-form-page.js');
      },
    },
    {
      path: '(.*)',
      component: 'not-found-page',
      action: async (context, commands) => {
        const el = document.createElement('div');
        el.innerHTML = `
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist. You can go to <a href="/">Home Page</a>.</p>
        `;

        if (!customElements.get('not-found-page')) {
          const { LitElement, html } = await import('lit');
          class NotFoundPage extends LitElement {
            createRenderRoot() { return this; }
            render() {
              return html`<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist. You can go to <a href="/">Home Page</a>.</p>`;
            }
          }
          customElements.define('not-found-page', NotFoundPage);
        }
        return commands.component('not-found-page');
      }
    }
  ]);
};