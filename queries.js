const db = require('./db'); // Import your database connection

class EmployeeQueries {
  static getAllDepartments() {
    const query = 'SELECT id, name FROM department';
    return db.promise().query(query);
  }

  static getAllRoles() {
    const query = `
      SELECT role.id AS id, role.title AS title, department.name AS department, role.salary
      FROM role AS role
      JOIN department AS department ON role.department_id = department.id
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
      FROM employee AS employee
      JOIN role AS role ON employee.role_id = role.id
      JOIN department AS department ON role.department_id = department.id
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `;
    return db.promise().query(query);
  }

  static addDepartment(departmentName) {
    const query = 'INSERT INTO department (name) VALUES (?)';
    return db.promise().query(query, [departmentName]);
  }

  static addRole(title, salary, departmentId) {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    return db.promise().query(query, [title, salary, departmentId]);
  }

  static addEmployee(firstName, lastName, roleId, managerId) {
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    return db.promise().query(query, [firstName, lastName, roleId, managerId]);
  }

  static updateEmployeeRole(employeeId, newRoleId) {
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    return db.promise().query(query, [newRoleId, employeeId]);
  }

  static updateEmployeeManager(employeeId, newManagerId) {
    const query = 'UPDATE employee SET manager_id = ? WHERE id = ?';
    return db.promise().query(query, [newManagerId, employeeId]);
  }

  static getEmployeesByManager(managerId) {
    const query = 'SELECT * FROM employee WHERE manager_id = ?';
    return db.promise().query(query, [managerId]);
  }

  static getEmployeesByDepartment(departmentId) {
    const query = 'SELECT * FROM employee WHERE department_id = ?';
    return db.promise().query(query, [departmentId]);
  }

  static deleteDepartment(departmentId) {
    const query = 'DELETE FROM department WHERE id = ?';
    return db.promise().query(query, [departmentId]);
  }

  static deleteRole(roleId) {
    const query = 'DELETE FROM role WHERE id = ?';
    return db.promise().query(query, [roleId]);
  }

  static deleteEmployee(employeeId) {
    const query = 'DELETE FROM employee WHERE id = ?';
    return db.promise().query(query, [employeeId]);
  }

  static getTotalBudgetByDepartment(departmentId) {
    const query = `
      SELECT SUM(role.salary) AS total_budget
      FROM employee AS employee
      JOIN role AS role ON employee.role_id = role.id
      WHERE role.department_id = ?
    `;
    return db.promise().query(query, [departmentId]);
  }
}

module.exports = EmployeeQueries;