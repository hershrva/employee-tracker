const db = require('./db');

class EmployeeQueries {
  static getAllDepartments() {
    const query = 'SELECT id, name FROM departments';
    return db.promise().query(query);
  }

  static getAllRoles() {
    const query = `
    SELECT role.id AS id, role.title AS title, role.department_id, role.salary, departments.name AS department
    FROM roles AS role
    LEFT JOIN departments ON role.department_id = departments.id
    `;
    return db.promise().query(query);
  }

  static getAllEmployees() {
    const query = `
    SELECT
    employee.id AS id,
    employee.first_name,
    employee.last_name,
    role.title AS title,
    department.name AS department,
    role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees AS employee
  JOIN roles AS role ON employee.role_id = role.id
  JOIN departments AS department ON role.department_id = department.id
  LEFT JOIN employees AS manager ON employee.manager_id = manager.id
    `;
    return db.promise().query(query);
  }

  static addDepartment(departmentName) {
    const query = 'INSERT INTO departments (name) VALUES (?)';
    return db.promise().query(query, [departmentName]);
  }

  static addRole(title, salary, departmentId) {
    const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
    return db.promise().query(query, [title, salary, departmentId]);
  }

  static addEmployee(firstName, lastName, roleId, managerId) {
    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    return db.promise().query(query, [firstName, lastName, roleId, managerId]);
  }

  static updateEmployeeRole(employeeId, newRoleId) {
    const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
    return db.promise().query(query, [newRoleId, employeeId]);
  }

  static updateEmployeeManager(employeeId, newManagerId) {
    const query = 'UPDATE employees SET manager_id = ? WHERE id = ?';
    return db.promise().query(query, [newManagerId, employeeId]);
  }

  static getEmployeesByManager(managerId) {
    console.log(`Selected manager ID: ${managerId}`);
    const query = `
      SELECT
        employees.id AS employee_id,
        employees.first_name,
        employees.last_name,
        roles.title AS role,
        departments.name AS department
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      WHERE employees.manager_id = ?;`; // Filter by manager ID
    return db.promise().query(query, [managerId]);
  }

  static getEmployeesByDepartment(departmentId) {
    console.log(`Selected department ID: ${departmentId}`);
    const query = `
      SELECT
        employees.id AS employee_id,
        employees.first_name,
        employees.last_name,
        roles.title AS role,
        departments.name AS department
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      WHERE departments.id = ?;`; // Filter by department ID
    return db.promise().query(query, [departmentId]);
  }

  static deleteDepartment(departmentId) {
    const query = 'DELETE FROM departments WHERE id = ?';
    return db.promise().query(query, [departmentId]);
  }

  static deleteRole(roleId) {
    const query = 'DELETE FROM roles WHERE id = ?';
    return db.promise().query(query, [roleId]);
  }

  static deleteEmployee(employeeId) {
    const updateQuery = `
      UPDATE employees
      SET manager_id = NULL
      WHERE manager_id = ?;
    `;
    
    const deleteQuery = `
      DELETE FROM employees
      WHERE id = ?;
    `;
    // Execute both queries in a transaction
    return db.promise().beginTransaction()
      .then(() => {
        return db.promise().query(updateQuery, [employeeId]);
      })
      .then(() => {
        return db.promise().query(deleteQuery, [employeeId]);
      })
      .then(() => {
        return db.promise().commit();
      })
      .catch((err) => {
        db.promise().rollback();
        throw err;
      });
  }

  static getTotalBudgetByDepartment(departmentId) {
    const query = `
        SELECT SUM(role.salary) AS total_budget
        FROM employees AS employee
        JOIN roles AS role ON employee.role_id = role.id
        WHERE role.department_id = ?
    `;
    return db.promise().query(query, [departmentId]);
  }
}

module.exports = EmployeeQueries;