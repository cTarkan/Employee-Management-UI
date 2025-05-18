// src/services/data-store.js
const STORAGE_KEY = 'employee_management_data';
import { employeesJsonData } from '../data/employees.js';

const initialEmployees = employeesJsonData.employees;

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const loadEmployees = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error("Failed to parse employees from localStorage", e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
  return initialEmployees;
};

let employees = loadEmployees();

export const __TEST_ONLY__resetStore = () => {
  localStorage.clear();
  employees = loadEmployees();
};

export const getEmployees = () => {
  return [...employees];
};

export const getEmployeeById = (id) => {
  return employees.find(emp => emp.id === id);
};

export const addEmployee = (employeeData) => {
  const newEmployee = {
    id: generateId(),
    ...employeeData,
  };
  employees = [...employees, newEmployee];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  return newEmployee;
};

export const updateEmployee = (id, updatedData) => {
  let updatedEmployee = null;
  employees = employees.map(emp => {
    if (emp.id === id) {
      updatedEmployee = { ...emp, ...updatedData };
      return updatedEmployee;
    }
    return emp;
  });
  if (updatedEmployee) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }
  return updatedEmployee;
};

export const deleteEmployee = (id) => {
  const initialLength = employees.length;
  employees = employees.filter(emp => emp.id !== id);
  if (employees.length < initialLength) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return true;
  }
  return false;
};