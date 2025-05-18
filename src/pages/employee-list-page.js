import { LitElement, html, css } from 'lit';
import { getEmployees, deleteEmployee } from '../services/data-store.js';
import { t } from '../localization/index.js';
import { Router } from '@vaadin/router';

const ITEMS_PER_PAGE = 5;

class EmployeeListPage extends LitElement {
  static properties = {
    _allEmployees: { state: true },
    _filteredEmployees: { state: true },
    employees: { type: Array },
    viewMode: { type: String },
    searchTerm: { type: String },
    currentPage: { type: Number },
  };

  static styles = css`
    :host { display: block; }
    .controls-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;}
    .search-controls input[type="search"] { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; min-width: 250px; }
    .search-controls input[type="search"]:focus { outline: none; border-color: var(--primary-color, #007bff); box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
    .view-toggle { display: flex; gap: 0.5rem; }
    .view-toggle button { padding: 0.5rem 1rem; border: 1px solid var(--primary-color, #007bff); background-color: white; color: var(--primary-color, #007bff); cursor: pointer; border-radius: 4px; font-weight: bold; }
    .view-toggle button.active { background-color: var(--primary-color, #007bff); color: white; }
    .view-toggle button:hover:not(.active) { background-color: #e9ecef; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th, td { border: 1px solid #ddd; padding: 0.75rem; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
    .actions button { margin-right: 0.5rem; padding: 0.3rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background-color: #fff; }
    .actions .edit-btn { color: var(--primary-color, #007bff); border-color: var(--primary-color, #007bff); }
    .actions .delete-btn { color: var(--danger-color, #dc3545); border-color: var(--danger-color, #dc3545); }
    .employee-list-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .employee-card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
    .employee-card h3 { margin-top: 0; margin-bottom: 0.75rem; color: var(--primary-color, #007bff); }
    .employee-card p { margin: 0.25rem 0; font-size: 0.9rem; }
    .employee-card .label { font-weight: bold; }
    .employee-card .actions { margin-top: 1rem; text-align: right; }
    
    .pagination-controls { margin-top: 1.5rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem; }
    .pagination-controls button { padding: 0.4rem 0.8rem; border: 1px solid #ccc; background-color: #fff; color: var(--primary-color, #007bff); cursor: pointer; border-radius: 4px; }
    .pagination-controls button:disabled { color: #999; border-color: #ddd; cursor: not-allowed; background-color: #f9f9f9; } 
    .pagination-controls button:hover:not(:disabled) { background-color: #e9ecef; }
    .pagination-controls .page-info { margin: 0 0.5rem; font-size: 0.9rem; }
  `;

  constructor() {
    super();
    this._allEmployees = [];
    this._filteredEmployees = [];
    this.employees = [];
    this.viewMode = 'table';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadAndProcessEmployees();
  }

  loadAndProcessEmployees() {
    this._allEmployees = getEmployees();
    this.filterAndPaginateEmployees();
  }

  handleSearchInputChange(event) {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.filterAndPaginateEmployees();
  }

  filterAndPaginateEmployees() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this._filteredEmployees = [...this._allEmployees];
    } else {
      this._filteredEmployees = this._allEmployees.filter(emp =>
        Object.values(emp).some(val =>
          String(val).toLowerCase().includes(term)
        )
      );
    }
    this.paginateEmployees();
  }

  paginateEmployees() {
    const startIndex = (this.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    this.employees = this._filteredEmployees.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this._filteredEmployees.length / ITEMS_PER_PAGE);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateEmployees();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateEmployees();
    }
  }

  setViewMode(mode) {
    if (mode === 'table' || mode === 'list') {
      this.viewMode = mode;
    }
  }

  handleEdit(employee) {
    if (employee && employee.id) Router.go(`/employees/edit/${employee.id}`);
    else console.error('Cannot edit employee: missing employee or employee ID.', employee);
  }

  handleDelete(employee) {
    if (!employee || !employee.id) {
      console.error('Cannot delete employee: missing employee or employee ID.');
      return;
    }
    const employeeFullName = `${employee.firstName} ${employee.lastName}`;
    const confirmationMessage = t('confirm_delete_employee', { name: employeeFullName });
    if (confirm(confirmationMessage)) {
      if (deleteEmployee(employee.id)) {
        this.currentPage = 1;
        this.loadAndProcessEmployees(); 
      } else {
        alert(t('error_delete_employee', { name: employeeFullName }));
      }
    }
  }


  renderTableView() {
    return html`
      <table>
        <thead>
          <tr>
            <th>${t('employee_firstName')}</th><th>${t('employee_lastName')}</th><th>${t('employee_email')}</th>
            <th>${t('employee_department')}</th><th>${t('employee_position')}</th><th>${t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(emp => html`
            <tr>
              <td>${emp.firstName}</td><td>${emp.lastName}</td><td>${emp.email}</td>
              <td>${t(`department_${emp.department.toLowerCase()}`, { fallback: emp.department })}</td>
              <td>${t(`position_${emp.position.toLowerCase()}`, { fallback: emp.position })}</td>
              <td class="actions">
                <button class="edit-btn" @click=${() => this.handleEdit(emp)}>${t('button_edit')}</button>
                <button class="delete-btn" @click=${() => this.handleDelete(emp)}>${t('button_delete')}</button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  renderListView() {
    return html`
      <div class="employee-list-cards">
        ${this.employees.map(emp => html`
          <div class="employee-card">
            <h3>${emp.firstName} ${emp.lastName}</h3>
            <p><span class="label">${t('employee_email')}:</span> ${emp.email}</p>
            <p><span class="label">${t('employee_phoneNumber')}:</span> ${emp.phoneNumber}</p>
            <p><span class="label">${t('employee_department')}:</span> ${t(`department_${emp.department.toLowerCase()}`, { fallback: emp.department })}</p>
            <p><span class="label">${t('employee_position')}:</span> ${t(`position_${emp.position.toLowerCase()}`, { fallback: emp.position })}</p>
            <p><span class="label">${t('employee_dateOfEmployment')}:</span> ${emp.dateOfEmployment}</p>
            <div class="actions">
              <button class="edit-btn" @click=${() => this.handleEdit(emp)}>${t('button_edit')}</button>
              <button class="delete-btn" @click=${() => this.handleDelete(emp)}>${t('button_delete')}</button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <div>
        <h1>${t('page_title_employee_list')}</h1>
        <div class="controls-bar">
          <div class="search-controls">
            <input
              type="search"
              placeholder="${t('search_placeholder')}"
              .value=${this.searchTerm}
              @input=${this.handleSearchInputChange}
              aria-label="${t('search_aria_label')}"
            />
          </div>
          <div class="view-toggle">
            <button class="${this.viewMode === 'table' ? 'active' : ''}" @click=${() => this.setViewMode('table')}>${t('button_view_table')}</button>
            <button class="${this.viewMode === 'list' ? 'active' : ''}" @click=${() => this.setViewMode('list')}>${t('button_view_list')}</button>
          </div>
        </div>

        ${this._filteredEmployees.length === 0 && this.searchTerm
          ? html`<p>${t('no_employees_found_search', { term: this.searchTerm })}</p>`
          : this._filteredEmployees.length === 0 && !this.searchTerm
            ? html`<p>${t('no_employees_found')}</p>`
            : this.viewMode === 'table'
              ? this.renderTableView() 
              : this.renderListView() 
        }

        ${this.totalPages > 1 ? html`
          <div class="pagination-controls">
            <button 
              @click=${this.goToPreviousPage} 
              ?disabled=${this.currentPage === 1}>
              ${t('button_previous', { fallback: 'Previous' })}
            </button>
            <span class="page-info">
              ${t('page_info', { currentPage: this.currentPage, totalPages: this.totalPages, fallback: `Page ${this.currentPage} of ${this.totalPages}` })}
            </span>
            <button 
              @click=${this.goToNextPage} 
              ?disabled=${this.currentPage === this.totalPages}>
              ${t('button_next', { fallback: 'Next' })}
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }
}
customElements.define('employee-list-page', EmployeeListPage);
