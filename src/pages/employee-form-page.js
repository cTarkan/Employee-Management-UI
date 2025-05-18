import { LitElement, html, css } from 'lit';
import { t } from '../localization/index.js';
import { addEmployee, getEmployeeById, updateEmployee } from '../services/data-store.js';
import { Router } from '@vaadin/router';

const DEPARTMENTS = ['Analytics', 'Tech'];
const POSITIONS = ['Junior', 'Medior', 'Senior'];

class EmployeeFormPage extends LitElement {
  static properties = {
    firstName: { type: String },
    lastName: { type: String },
    dateOfEmployment: { type: String },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String },
    department: { type: String }, 
    position: { type: String },  
    errors: { type: Object },
    mode: { type: String },
    employeeId: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 600px; 
      margin: 0 auto; 
      padding-bottom: 2rem; 
    }
    form {
      display: grid;
      grid-template-columns: 1fr; 
      gap: 1rem; 
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    label {
      margin-bottom: 0.25rem;
      font-weight: bold;
    }
    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="date"],
    select {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="tel"]:focus,
    input[type="date"]:focus,
    select:focus {
      outline: none;
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
    .error-message {
      color: var(--danger-color, #dc3545);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    input.invalid, select.invalid {
      border-color: var(--danger-color, #dc3545);
    }
    .form-actions {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end; 
      gap: 0.5rem;
    }
    button {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .submit-btn {
      background-color: var(--success-color, #28a745);
      color: white;
    }
    .submit-btn:hover {
      background-color: #218838; 
    }
    .cancel-btn {
      background-color: var(--secondary-color, #6c757d);
      color: white;
    }
    .cancel-btn:hover {
      background-color: #5a6268;
    }
  `;

constructor() {
  super();
  this.employeeId = null;
  this.firstName = '';
  this.lastName = '';
  this.dateOfEmployment = '';
  this.dateOfBirth = '';
  this.phoneNumber = '';
  this.emailAddress = '';
  this.department = DEPARTMENTS[0]; 
  this.position = POSITIONS[0];
  this.errors = {};
}

resetFormFields() {
  this.firstName = '';
  this.lastName = '';
  this.dateOfEmployment = '';
  this.dateOfBirth = '';
  this.phoneNumber = '';
  this.emailAddress = '';
  this.department = DEPARTMENTS[0]; 
  this.position = POSITIONS[0];    
  this.errors = {};

}

async populateFormForEdit(employee) { 
  this.firstName = employee.firstName;
  this.lastName = employee.lastName;
  this.dateOfEmployment = employee.dateOfEmployment;
  this.dateOfBirth = employee.dateOfBirth;
  this.phoneNumber = employee.phoneNumber;
  this.emailAddress = employee.email;
  this.department = employee.department;
  this.position = employee.position;
  
  this.errors = {};

  await this.updateComplete; 

  const departmentSelect = this.renderRoot.querySelector('#department');
  const positionSelect = this.renderRoot.querySelector('#position');

  if (departmentSelect) {
    departmentSelect.value = employee.department; 
    console.log('Manually set department select value to:', departmentSelect.value);
  } 
  
  if (positionSelect) {
    positionSelect.value = employee.position;
    console.log('Manually set position select value to:', positionSelect.value);
  } 
}

connectedCallback() {
  super.connectedCallback();
  if (this.location && this.location.params && this.location.params.id) {
    this.mode = 'edit';
    this.employeeId = this.location.params.id;
    const employeeToEdit = getEmployeeById(this.employeeId);
    if (employeeToEdit) {
      this.populateFormForEdit(employeeToEdit);
    } else {
      console.error(`Edit Mode: Employee with ID ${this.employeeId} not found.`);
      Router.go('/employees');
    }
  } else {
    this.mode = 'add';
    this.employeeId = null;
    this.resetFormFields(); 
  }
}




  handleInputChange(event) {
    const { name, value } = event.target;
    this[name] = value;
    if (this.errors[name]) {
      this.errors = { ...this.errors, [name]: null };
    }
  }

  validateForm() {
    const newErrors = {};
    if (!this.firstName.trim()) newErrors.firstName = t('validation_required_firstName');
    if (!this.lastName.trim()) newErrors.lastName = t('validation_required_lastName');
    if (!this.dateOfEmployment) newErrors.dateOfEmployment = t('validation_required_dateOfEmployment');
    if (!this.dateOfBirth) newErrors.dateOfBirth = t('validation_required_dateOfBirth');
    if (!this.phoneNumber.trim()) newErrors.phoneNumber = t('validation_required_phoneNumber');

    if (!this.emailAddress.trim()) {
      newErrors.emailAddress = t('validation_required_emailAddress');
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.emailAddress)) {
        newErrors.emailAddress = t('validation_invalid_emailAddress');
      }
     
    }
    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    }

    const employeeData = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      dateOfEmployment: this.dateOfEmployment,
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber.trim(),
      email: this.emailAddress.trim(),
      department: this.department,
      position: this.position,
    };

    if (this.mode === 'edit') {
      const confirmUpdate = confirm(t('confirm_update_employee', { fallback: 'Are you sure you want to update this employee record?' }));
      if (confirmUpdate) {
        updateEmployee(this.employeeId, employeeData);
        console.log('Employee updated:', this.employeeId, employeeData);
        Router.go('/employees');
      }
    } else { 
      addEmployee(employeeData);
      console.log('Employee added:', employeeData);
      Router.go('/employees');
    }
  }

  handleCancel() {
    Router.go('/employees');
  }

  render() {
    const pageTitle = this.mode === 'edit'
      ? t('page_title_edit_employee', { fallback: 'Edit Employee' })
      : t('page_title_add_employee', { fallback: 'Add New Employee' });

    const submitButtonText = this.mode === 'edit'
      ? t('button_save_changes', { fallback: 'Save Changes' })
      : t('button_add_employee', { fallback: 'Add Employee' });

    return html`
      <div>
        <h1 class="form-title">${pageTitle}</h1>
        <form @submit=${this.handleSubmit} novalidate>
          <!-- First Name -->
          <div class="form-group">
            <label for="firstName">${t('form_label_firstName', { fallback: 'First Name' })}*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              .value=${this.firstName ?? ''}
              @input=${this.handleInputChange}
              class=${this.errors.firstName ? 'invalid' : ''}
              required
            />
            ${this.errors.firstName ? html`<div class="error-message">${this.errors.firstName}</div>` : ''}
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label for="lastName">${t('form_label_lastName', { fallback: 'Last Name' })}*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              .value=${this.lastName ?? ''}
              @input=${this.handleInputChange}
              class=${this.errors.lastName ? 'invalid' : ''}
              required
            />
            ${this.errors.lastName ? html`<div class="error-message">${this.errors.lastName}</div>` : ''}
          </div>
          
          <!-- Date of Employment -->
          <div class="form-group">
            <label for="dateOfEmployment">${t('form_label_dateOfEmployment', { fallback: 'Date of Employment' })}*</label>
            <input
              type="date"
              id="dateOfEmployment"
              name="dateOfEmployment"
              .value=${this.dateOfEmployment ?? ''}
              @input=${this.handleInputChange}
              class=${this.errors.dateOfEmployment ? 'invalid' : ''}
              required
            />
            ${this.errors.dateOfEmployment ? html`<div class="error-message">${this.errors.dateOfEmployment}</div>` : ''}
          </div>

          <!-- Date of Birth -->
          <div class="form-group">
            <label for="dateOfBirth">${t('form_label_dateOfBirth', { fallback: 'Date of Birth' })}*</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              .value=${this.dateOfBirth ?? ''}
              @input=${this.handleInputChange}
              class=${this.errors.dateOfBirth ? 'invalid' : ''}
              required
            />
            ${this.errors.dateOfBirth ? html`<div class="error-message">${this.errors.dateOfBirth}</div>` : ''}
          </div>

          <!-- Phone Number -->
          <div class="form-group">
            <label for="phoneNumber">${t('form_label_phoneNumber', { fallback: 'Phone Number' })}*</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              .value=${this.phoneNumber ?? ''}
              @input=${this.handleInputChange}
              class=${this.errors.phoneNumber ? 'invalid' : ''}
              required
            />
            ${this.errors.phoneNumber ? html`<div class="error-message">${this.errors.phoneNumber}</div>` : ''}
          </div>

          <!-- Email Address -->
          <div class="form-group">
            <label for="emailAddress">${t('form_label_emailAddress', { fallback: 'Email Address' })}*</label>
            <input
              type="email"
              id="emailAddress"
              name="emailAddress"
              .value=${this.emailAddress ?? ''}
              @input=${this.handleInputChange}
              class=${this.errors.emailAddress ? 'invalid' : ''}
              required
            />
            ${this.errors.emailAddress ? html`<div class="error-message">${this.errors.emailAddress}</div>` : ''}
          </div>

          <!-- Department -->
          <div class="form-group">
            <label for="department">${t('form_label_department', { fallback: 'Department' })}*</label>
            <select
              id="department"
              name="department"
              .value=${this.department ?? DEPARTMENTS[0]}
              @change=${this.handleInputChange}
              required>
              ${DEPARTMENTS.map(
      (dept) => html`<option value="${dept}">${t(`department_${dept.toLowerCase()}`, { fallback: dept })}</option>`
    )}
            </select>
          </div>

          <!-- Position -->
          <div class="form-group">
            <label for="position">${t('form_label_position', { fallback: 'Position' })}*</label>
            <select
              id="position"
              name="position"
              .value=${this.position ?? POSITIONS[0]}
              @change=${this.handleInputChange}
              required>
              ${POSITIONS.map(
      (pos) => html`<option value="${pos}">${t(`position_${pos.toLowerCase()}`, { fallback: pos })}</option>`
    )}
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click=${this.handleCancel}>
              ${t('button_cancel', { fallback: 'Cancel' })}
            </button>
            <button type="submit" class="submit-btn">
              ${submitButtonText}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
customElements.define('employee-form-page', EmployeeFormPage);