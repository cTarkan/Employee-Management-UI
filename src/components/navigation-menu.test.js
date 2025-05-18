import { html, fixture, expect, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import './navigation-menu.js'; 
import { setLanguage, t } from '../localization/index.js'; 

describe('NavigationMenu Component', () => {
  beforeEach(() => {
    setLanguage('en');
    document.documentElement.lang = 'en';
  });

  it('renders two navigation links by default', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const links = el.shadowRoot.querySelectorAll('nav ul li a');
    expect(links.length).to.equal(2);
  });

  it('displays correct link text in English', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const links = el.shadowRoot.querySelectorAll('nav ul li a');
    expect(links[0].textContent.trim()).to.equal(t('nav_employee_list')); 
    expect(links[1].textContent.trim()).to.equal(t('nav_add_employee')); 
  });

  it('displays correct link text in Turkish after language change', async () => {
    setLanguage('tr'); 
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    await el.updateComplete; 

    const links = el.shadowRoot.querySelectorAll('nav ul li a');
    const elTr = await fixture(html`<navigation-menu></navigation-menu>`);
    const linksTr = elTr.shadowRoot.querySelectorAll('nav ul li a');
    expect(linksTr[0].textContent.trim()).to.equal('Çalışan Listesi');
    expect(linksTr[1].textContent.trim()).to.equal('Yeni Çalışan Ekle');
  });

  
  it('has correct href attributes for links', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const links = el.shadowRoot.querySelectorAll('nav ul li a');
    expect(links[0].getAttribute('href')).to.equal('/employees');
    expect(links[1].getAttribute('href')).to.equal('/add-employee');
  });

});