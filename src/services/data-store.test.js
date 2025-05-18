// src/services/data-store.test.js
import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import {
  getEmployees,
  addEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  __TEST_ONLY__resetStore,
  generateId,
  loadEmployees
} from './data-store.js';
import { t, setLanguage } from '../localization/index.js';
import { employeesJsonData } from '../data/employees.js';

describe('Data Store', () => {
  const STORAGE_KEY_TEST = 'employee_management_data';
  let localStorageStubs;

  beforeEach(() => {
    let store = {};
    localStorageStubs = {
      getItem: sinon.stub(window.localStorage, 'getItem').callsFake(key => store[key] || null),
      setItem: sinon.stub(window.localStorage, 'setItem').callsFake((key, value) => { store[key] = value.toString(); }),
      removeItem: sinon.stub(window.localStorage, 'removeItem').callsFake(key => { delete store[key]; }),
      clear: sinon.stub(window.localStorage, 'clear').callsFake(() => { store = {}; })
    };
    __TEST_ONLY__resetStore();
  });

  afterEach(() => {
    localStorageStubs.getItem.restore();
    localStorageStubs.setItem.restore();
    localStorageStubs.removeItem.restore();
    localStorageStubs.clear.restore();
  });

  describe('CRUD Operations', () => {
    it('should retrieve initial employees correctly', () => {
      const employees = getEmployees();
      const johnDoe = employees.find(emp => emp.id === '1');
      expect(johnDoe).to.exist;
      expect(johnDoe.firstName).to.equal('John');
      expect(employees.length).to.be.greaterThanOrEqual(employeesJsonData.employees.length);
    });

    it('should add a new employee', () => {
      const initialLength = getEmployees().length;
      const newEmployeeData = {
        firstName: 'Test', lastName: 'User', email: 'test.user@example.com',
        dateOfEmployment: '2024-01-01', dateOfBirth: '1995-01-01',
        phoneNumber: '123-4567', department: 'Tech', position: 'Junior'
      };
      const addedEmployee = addEmployee(newEmployeeData);
      expect(addedEmployee).to.exist;
      expect(addedEmployee.id).to.be.a('string');
      expect(addedEmployee.firstName).to.equal('Test');
      const employees = getEmployees();
      expect(employees.length).to.equal(initialLength + 1);
      const found = employees.find(emp => emp.id === addedEmployee.id);
      expect(found).to.deep.equal(addedEmployee);
      expect(localStorageStubs.setItem.calledWith(STORAGE_KEY_TEST, sinon.match.string)).to.be.true;
      const storedDataInMock = JSON.parse(localStorage.getItem(STORAGE_KEY_TEST));
      expect(storedDataInMock.some(emp => emp.id === addedEmployee.id)).to.be.true;
    });

    it('should get an employee by ID', () => {
      const empData = { firstName: 'FindMe', email: 'findme@example.com', department: 'Tech', position: 'Medior' };
      const added = addEmployee(empData);
      const foundEmployee = getEmployeeById(added.id);
      expect(foundEmployee).to.exist;
      expect(foundEmployee.firstName).to.equal('FindMe');
      const notFound = getEmployeeById('non-existent-id');
      expect(notFound).to.be.undefined;
    });

    it('should update an existing employee', () => {
      const empData = { firstName: 'Update', lastName: 'Me', email: 'update@example.com', department: 'Analytics', position: 'Junior' };
      const addedFirst = addEmployee(empData);
      const updates = { lastName: 'Updated', position: 'Senior' };
      const updatedEmployee = updateEmployee(addedFirst.id, updates);
      expect(updatedEmployee).to.exist;
      expect(updatedEmployee.id).to.equal(addedFirst.id);
      expect(updatedEmployee.lastName).to.equal('Updated');
      expect(updatedEmployee.position).to.equal('Senior');
      expect(updatedEmployee.firstName).to.equal('Update');
      const refetched = getEmployeeById(addedFirst.id);
      expect(refetched.lastName).to.equal('Updated');
      expect(localStorageStubs.setItem.calledWith(STORAGE_KEY_TEST, sinon.match.string)).to.be.true;
    });

    it('should not update if employee ID does not exist and not call setItem', () => {
      const initialLength = getEmployees().length;
      const setItemSpy = localStorageStubs.setItem;
      setItemSpy.resetHistory(); 
      const updated = updateEmployee('wrong-id', { firstName: 'Ghost' });
      expect(updated).to.be.null;
      expect(getEmployees().length).to.equal(initialLength);
      expect(setItemSpy.called).to.be.false;
    });

    it('should delete an employee and update localStorage', () => {
      const empData = { firstName: 'Delete', lastName: 'This', email: 'delete@example.com', department: 'Tech', position: 'Junior' };
      const added = addEmployee(empData);
      const initialLength = getEmployees().length;
      const result = deleteEmployee(added.id);
      expect(result).to.be.true;
      expect(getEmployees().length).to.equal(initialLength - 1);
      expect(getEmployeeById(added.id)).to.be.undefined;
      expect(localStorageStubs.setItem.calledWith(STORAGE_KEY_TEST, sinon.match.string)).to.be.true;
    });

    it('should return false when trying to delete non-existent employee and not call setItem', () => {
      const initialLength = getEmployees().length;
      const setItemSpy = localStorageStubs.setItem;
      setItemSpy.resetHistory();
      const result = deleteEmployee('non-existent-id');
      expect(result).to.be.false;
      expect(getEmployees().length).to.equal(initialLength);
      expect(setItemSpy.called).to.be.false;
    });
  });

  describe('Helper Functions', () => {
    it('generateId should return a string ID and different IDs on subsequent calls', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).to.be.a('string');
      expect(id1.length).to.be.greaterThan(5);
      expect(id2).to.be.a('string');
      expect(id1).to.not.equal(id2);
    });

    it('loadEmployees should load from localStorage if data exists and is valid', () => {
      localStorageStubs.clear.resetHistory();
      localStorageStubs.getItem.resetHistory();
      localStorageStubs.setItem.resetHistory();
      const mockData = [{ id: 'test1', firstName: 'Stored User' }];
      localStorageStubs.setItem(STORAGE_KEY_TEST, JSON.stringify(mockData)); // Manually set via stubbed method

      const loaded = loadEmployees(); // Directly test loadEmployees
      expect(loaded).to.deep.equal(mockData);
      expect(localStorageStubs.getItem.calledWith(STORAGE_KEY_TEST)).to.be.true;
      expect(localStorageStubs.setItem.called).to.be.false; // Should not set if loaded from storage
    });

    it('loadEmployees should handle invalid JSON in localStorage and return initialEmployees', () => {
      localStorageStubs.clear.resetHistory();
      localStorageStubs.getItem.resetHistory();
      localStorageStubs.setItem.resetHistory();
      localStorageStubs.removeItem.resetHistory();
      localStorageStubs.setItem(STORAGE_KEY_TEST, 'this is not json'); // Manually set via stubbed method

      const consoleErrorSpy = sinon.spy(console, 'error');
      const loaded = loadEmployees();

      expect(consoleErrorSpy.calledWith("Failed to parse employees from localStorage", sinon.match.any)).to.be.true;
      expect(localStorageStubs.removeItem.calledWith(STORAGE_KEY_TEST)).to.be.true;
      expect(localStorageStubs.setItem.calledWith(STORAGE_KEY_TEST, JSON.stringify(employeesJsonData.employees))).to.be.true; // Should set initial after removing invalid
      expect(loaded).to.deep.equal(employeesJsonData.employees);
      consoleErrorSpy.restore();
    });

    it('loadEmployees should load initial employees and set localStorage if it is empty', () => {
      localStorageStubs.clear(); // Clears the internal store of the mock
      localStorageStubs.getItem.resetHistory();
      localStorageStubs.setItem.resetHistory();
      
      const loaded = loadEmployees();
      expect(loaded).to.deep.equal(employeesJsonData.employees);
      expect(localStorageStubs.getItem.calledWith(STORAGE_KEY_TEST)).to.be.true; // Will be called, returns null
      expect(localStorageStubs.setItem.calledWith(STORAGE_KEY_TEST, JSON.stringify(employeesJsonData.employees))).to.be.true;
    });
  });
});

describe('Localization Service', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en';
    setLanguage('en');
  });

  it('should return English translation for a known key', () => {
    expect(t('app_title')).to.equal('Employee Management');
  });

  it('should return Turkish translation after language is set to tr', () => {
    setLanguage('tr');
    expect(t('app_title')).to.equal('Çalışan Yönetimi');
  });

  it('should return the key itself if translation is not found', () => {
    expect(t('unknown_key_for_testing')).to.equal('unknown_key_for_testing');
  });

  it('should replace params in translated string', () => {
    setLanguage('en');
    expect(t('no_employees_found_search', { term: 'XYZ' })).to.equal('No employees found matching "XYZ".');
  });

  it('should fallback to English if requested language translations are not found', () => {
    const consoleWarnSpy = sinon.spy(console, 'warn');
    setLanguage('es');
    expect(t('app_title')).to.equal('Employee Management');
    expect(consoleWarnSpy.calledWith('Translations for language "es" not found. Falling back to "en".')).to.be.true;
    consoleWarnSpy.restore();
  });
});