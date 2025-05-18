
import { LitElement, html, css } from 'lit';
import { getEmployees, deleteEmployee } from '../services/data-store.js';
import { t } from '../localization/index.js';
import { Router } from '@vaadin/router';

class EmployeeListPage extends LitElement {
  static properties = {
    employees: { type: Array },
    viewMode: { type: String }
  };

  static styles = css`
  :host {
    display: block;
  }


  .view-toggle {
    margin-bottom: 1rem;
    display: flex;
    gap: 0.5rem;
  }
  .view-toggle button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--primary-color, #007bff);
    background-color: white;
    color: var(--primary-color, #007bff);
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }
  .view-toggle button.active {
    background-color: var(--primary-color, #007bff);
    color: white;
  }
  .view-toggle button:hover:not(.active) {
    background-color: #e9ecef;
  }


  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  .actions button {
    margin-right: 0.5rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
  }
  .actions .edit-btn {
    color: var(--primary-color, #007bff);
    border-color: var(--primary-color, #007bff);
  }
  .actions .delete-btn {
    color: var(--danger-color, #dc3545);
    border-color: var(--danger-color, #dc3545);
  }


  .employee-list-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  .employee-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  }
  .employee-card h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: var(--primary-color, #007bff);
  }
  .employee-card p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
  .employee-card .label {
    font-weight: bold;
  }
  .employee-card .actions {
    margin-top: 1rem;
    text-align: right;
  }
  
`;

  constructor() {
    super();
    this.employees = [];
    this.viewMode = 'table';
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployeeData();
    
  }

  

  loadEmployeeData() {
    this.employees = getEmployees();
  }

  handleEdit(employee) {
    if (employee && employee.id) {
      Router.go(`/employees/edit/${employee.id}`);
    } else {
      console.error('Cannot edit employee: missing employee or employee ID.', employee);
    }
  }

  handleDelete(employee) {
    if (!employee || !employee.id) {
      console.error('Cannot delete employee: missing employee or employee ID.');
      return;
    }

        const employeeFullName = `${employee.firstName} ${employee.lastName}`;
    const confirmationMessage = t('confirm_delete_employee', {
      name: employeeFullName,
      fallback: `Are you sure you want to delete ${employeeFullName}?`
    });

    if (confirm(confirmationMessage)) {
      const success = deleteEmployee(employee.id);
      if (success) {
        console.log(`Employee ${employeeFullName} (ID: ${employee.id}) deleted successfully.`);
                this.loadEmployeeData();
      } else {
        console.error(`Failed to delete employee ${employeeFullName} (ID: ${employee.id}).`);

        alert(t('error_delete_employee', {
          name: employeeFullName,
          fallback: `Could not delete employee ${employeeFullName}. The record might have already been removed or an error occurred.`
        }));
      }
    } else {
      console.log('Deletion cancelled by user for employee:', employeeFullName);
    }
  }

  setViewMode(mode) {
    if (mode === 'table' || mode === 'list') {
      this.viewMode = mode;
    }
  }


  renderTableView() {
    return html`
      <table>
        <thead>
          <tr>
            <th>${t('employee_firstName', { fallback: 'First Name' })}</th>
            <th>${t('employee_lastName', { fallback: 'Last Name' })}</th>
            <th>${t('employee_email', { fallback: 'Email' })}</th>
            <th>${t('employee_department', { fallback: 'Department' })}</th>
            <th>${t('employee_position', { fallback: 'Position' })}</th>
            <th>${t('actions', { fallback: 'Actions' })}</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
      (emp) => html`
              <tr>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.email}</td>
                <td>${t(`department_${emp.department.toLowerCase()}`, { fallback: emp.department })}</td>
                <td>${t(`position_${emp.position.toLowerCase()}`, { fallback: emp.position })}</td>
                <td class="actions">
                  <button class="edit-btn" @click=${() => this.handleEdit(emp)}>
                    ${t('button_edit', { fallback: 'Edit' })}
                  </button>
                  <button class="delete-btn" @click=${() => this.handleDelete(emp)}>
                    ${t('button_delete', { fallback: 'Delete' })}
                  </button>
                </td>
              </tr>
            `
    )}
        </tbody>
      </table>
    `;
  }

  renderListView() {
    return html`
      <div class="employee-list-cards">
        ${this.employees.map(
      (emp) => html`
            <div class="employee-card">
              <h3>${emp.firstName} ${emp.lastName}</h3>
              <p><span class="label">${t('employee_email', { fallback: 'Email' })}:</span> ${emp.email}</p>
              <p><span class="label">${t('employee_phoneNumber', { fallback: 'Phone' })}:</span> ${emp.phoneNumber}</p>
              <p><span class="label">${t('employee_department', { fallback: 'Department' })}:</span> ${t(`department_${emp.department.toLowerCase()}`, { fallback: emp.department })}</p>
              <p><span class="label">${t('employee_position', { fallback: 'Position' })}:</span> ${t(`position_${emp.position.toLowerCase()}`, { fallback: emp.position })}</p>
              <p><span class="label">${t('employee_dateOfEmployment', { fallback: 'Employed' })}:</span> ${emp.dateOfEmployment}</p> 
              
              <div class="actions">
                <button class="edit-btn" @click=${() => this.handleEdit(emp)}>
                  ${t('button_edit', { fallback: 'Edit' })}
                </button>
                <button class="delete-btn" @click=${() => this.handleDelete(emp)}>
                  ${t('button_delete', { fallback: 'Delete' })}
                </button>
              </div>
            </div>
          `
    )}
      </div>
    `;
  }

  render() {
    return html`
      <div>
        <h1>${t('page_title_employee_list')}</h1>
        
        <div class="view-toggle">
          <button 
            class="${this.viewMode === 'table' ? 'active' : ''}" 
            @click=${() => this.setViewMode('table')}>
            ${t('button_view_table', { fallback: 'Table View' })}
          </button>
          <button 
            class="${this.viewMode === 'list' ? 'active' : ''}" 
            @click=${() => this.setViewMode('list')}>
            ${t('button_view_list', { fallback: 'List View' })}
          </button>
        </div>

        ${this.employees.length === 0
        ? html`<p>${t('no_employees_found', { fallback: 'No employees found.' })}</p>`
        : this.viewMode === 'table'
          ? this.renderTableView()
          : this.renderListView()
      }
      </div>
    `;
  }
}
customElements.define('employee-list-page', EmployeeListPage);
