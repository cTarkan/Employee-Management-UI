const STORAGE_KEY = 'employee_management_data';
const initialEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '2022-01-15',
    dateOfBirth: '1990-05-20',
    phoneNumber: '555-0101',
    email: 'john.doe@example.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfEmployment: '2021-11-01',
    dateOfBirth: '1992-08-10',
    phoneNumber: '555-0102',
    email: 'jane.smith@example.com',
    department: 'Analytics',
    position: 'Medior',
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    dateOfEmployment: '2023-03-01',
    dateOfBirth: '1988-12-30',
    phoneNumber: '555-0103',
    email: 'alice.johnson@example.com',
    department: 'Tech',
    position: 'Junior',
  },
];

const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

const loadEmployees = () => {
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

