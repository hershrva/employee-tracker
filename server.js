const mysql = require('mysql2');
const inquirer = require('inquirer');
const Employee = require('./employeeModel'); // Import your models for employees, roles, and departments
const Role = require('./roleModel');
const Department = require('./departmentModel');

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'books_db'
    },
    console.log(`Connected to the books_db database.`)
  );

async function main() {
  const userChoice = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
    ],
  });

  switch (userChoice.action) {
    case 'View All Employees':
      // Implement the logic for viewing all employees
      break;
    case 'Add Employee':
      // Implement the logic for adding an employee
      break;
    case 'Update Employee Role':
      // Implement the logic for updating an employee's role
      break;
    case 'View All Roles':
      // Implement the logic for viewing all roles
      break;
    case 'Add Role':
      // Implement the logic for adding a role
      break;
    case 'View All Departments':
      // Implement the logic for viewing all departments
      break;
    case 'Add Department':
      // Implement the logic for adding a department
      break;
    default:
      console.log('Invalid choice');
  }
}

main();