const mysql = require('mysql2');
const inquirer = require('inquirer');
const EmployeeQueries = require('./queries');

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
      'Update Employee Manager',
      'View Employees by Manager',
      'View Employees by Department',
      'Delete Department',
      'Delete Role',
      'Delete Employee',
      'View Department Budget',
    ],
  });

    const roles = await EmployeeQueries.getAllRoles();
    const roleChoices = roles[0].map((role) => ({
        name:role.title,
        value: role.id,
    }));
        
    const employees = await EmployeeQueries.getAllEmployees();
    const employeeChoices = employees[0].map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const departments = await EmployeeQueries.getAllDepartments();
    const departmentChoices = departments[0].map((departments) => ({
        name: department.name,
        value: department.id,
    }));

    const managerChoices = employees[0]
        .filter((employee) => employee.manager_id !== null)
        .map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
    managerChoices.push({name: 'None', value: null});

  switch (userChoice.action) {
    case 'View All Employees':
        console.table(employees[0]);
        break;
    case 'Add Employee':
        const employeeDetails = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roleChoices,
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: managerChoices,
            }
        ]);
        await EmployeeQueries.addEmployee(
            employeeDetails.firstName,
            employeeDetails.lastName,
            employeeDetails.roleId,
            employeeDetails.managerId
        );
        console.log(`Added '${employeeDetails.firstName} ${employeeDetails.lastName}' to the database`)
        break;
    case 'Update Employee Role':
        const updateEmployeeDetails = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Which employee's role do you want to update?",
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'roleId',
                message: "Which role do you want to assign the selected employee?",
                choices: roleChoices,
            },
        ]);

        await EmployeeQueries.updateEmployeeRole(
            updateEmployeeDetails.employeeId,
            updateEmployeeDetails.roleId
        );

        console.log('Employee role updated successfully');
        break;
    case 'View All Roles':
        console.table(roles[0]);
        break;
    case 'Add Role':
        const roleDetails = await inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: "What is the name of the role?",
            },
            {
              type: 'input',
              name: 'salary',
              message: "What is the salary for the role?",
            },
            {
              type: 'list',
              name: 'departmentId',
              message: "Which department does the role belong to?",
              choices: departmentChoices,
            },
          ]);
          
          await EmployeeQueries.addRole(roleDetails.title, roleDetails.salary, roleDetails.departmentId);
          
          console.log(`Added '${roleDetails.title}' to the database.`);
        break;
    case 'View All Departments':
        console.table(departments[0]);
        break;
    case 'Add Department':
        const departmentDetails = await inquirer.prompt([
            {
              type: 'input',
              name: 'name',
              message: "What is the name of the department?",
            },
          ]);
          
          await EmployeeQueries.addDepartment(departmentDetails.name);
          
          console.log(`Added '${departmentDetails.name}' to the database.`);
        break;
    case 'Update Employee Manager':
        const managerDetails = await inquirer.prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: "Which employee's manager do you want to update?",
              choices: employeeChoices,
            },
            {
              type: 'list',
              name: 'newManagerId',
              message: 'Who should be the new manager?',
              choices: managerChoices,
            },
        ]);

        await EmployeeQueries.updateEmployeeManager(
            managerDetails.employeeId,
            managerDetails.newMangerId,
        );

        console.log('Employee manager updated successfully.')

        break;
    case 'View Employees by Manager':
        const managerSelection = await inquirer.prompt({
            type: 'list',
            name: 'managerId',
            message: 'Which manager would you like to view the employees of?',
            choices: managerChoices,
          });
        
        const employeesByManager = await EmployeeQueries.getEmployeesByManager(
            managerSelection.managerId
        );

        console.table(employeesByManager);
        break;
    case 'View Employees by Department':
        const departmentSelection = await inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Which department would you like to view the employees of?',
            choices: departmentChoices,
        });

        const employeesByDepartment = await EmployeeQueries.getEmployeesByDepartment(
            departmentSelection.departmentId
        );

        console.table(employeesByDepartment);
        break;
    case 'Delete Department':
        const departmentSelection = await inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to delete:',
            choices: departmentChoices,
        });
          

        await EmployeeQueries.deleteDepartment(departmentSelection.departmentId);
          
        console.log(`Department has been deleted.`);
        break;
    case 'Delete Role':
        const roleSelection = await inquirer.prompt({
            type: 'list',
            name: 'roleId',
            message: 'Select a role to delete:',
            choices: roleChoices,
        });
          
        await EmployeeQueries.deleteRole(roleSelection.roleId);
          
        console.log(`Role has been deleted.`);
        break;
    case 'Delete Employee':
        const employeeSelection = await inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to delete:',
            choices: employeeChoices,
        });
          
        await EmployeeQueries.deleteEmployee(employeeSelection.employeeId);
          
        console.log(`Employee has been deleted.`);
        break;
    case 'View Department Budget':
        const deleteDepartmentSelection = await inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to view the budget:',
            choices: departmentChoices,
        });
          
        const budgetResult = await EmployeeQueries.getTotalBudgetByDepartment(
            deleteDepartmentSelection.departmentId
        );

        console.log(`Total budget for the Department: $${budgetResult[0][0].total_budget}`);
        break;
    default:
      console.log('Invalid choice');
  }
}

main();