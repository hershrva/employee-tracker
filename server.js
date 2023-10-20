const inquirer = require('inquirer');
const EmployeeQueries = require('./queries');

async function main() {
  while (true) {
    let roles, employees, departments, roleChoices, employeeChoices, departmentChoices, managerChoices;

    const userChoice = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View Employees by Manager',
        'View Employees by Department',
        'Add Employee',
        'Delete Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Roles',
        'Add Role',
        'Delete Role',
        'View All Departments',
        'Add Department',
        'Delete Department',
        'View Department Budget',
        'Exit',
      ],
    });

    switch (userChoice.action) {
      case 'View All Employees':
        employees = await EmployeeQueries.getAllEmployees();
        console.table(employees[0]);
        break;
      case 'Add Employee':
        roles = await EmployeeQueries.getAllRoles();
        roleChoices = roles[0].map((role) => ({
          name: role.title,
          value: role.id,
        }));

        employees = await EmployeeQueries.getAllEmployees();
        employeeChoices = employees[0].map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        managerChoices = employees[0]
          .filter((employee) => employee.manager_id !== null)
          .map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }));
        managerChoices.push({ name: 'None', value: null });

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
          },
        ]);

        await EmployeeQueries.addEmployee(
          employeeDetails.firstName,
          employeeDetails.lastName,
          employeeDetails.roleId,
          employeeDetails.managerId
        );

        console.log(`Added '${employeeDetails.firstName} ${employeeDetails.lastName}' to the database`);
        break;
      case 'Update Employee Role':
        employees = await EmployeeQueries.getAllEmployees();
        employeeChoices = employees[0].map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        roles = await EmployeeQueries.getAllRoles();
        roleChoices = roles[0].map((role) => ({
          name: role.title,
          value: role.id,
        }));

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
        roles = await EmployeeQueries.getAllRoles();
        console.table(roles[0]);
        break;
      case 'Add Role':
        departments = await EmployeeQueries.getAllDepartments();
        departmentChoices = departments[0].map((department) => ({
          name: department.name,
          value: department.id,
        }));

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
        departments = await EmployeeQueries.getAllDepartments();
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
        employees = await EmployeeQueries.getAllEmployees();
        employeeChoices = employees[0].map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        managerChoices = employees[0]
          .filter((employee) => employee.manager_id !== null)
          .map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }));
        managerChoices.push({ name: 'None', value: null });

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
          managerDetails.newManagerId
        );

        console.log('Employee manager updated successfully');
        break;
      case 'View Employees by Manager':
        employees = await EmployeeQueries.getAllEmployees();
        employeeChoices = employees[0].map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        managerChoices = employees[0]
          .filter((employee) => employee.manager_id !== null)
          .map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }));
        managerChoices.push({ name: 'None', value: null });

        const managerSelection = await inquirer.prompt({
          type: 'list',
          name: 'managerId',
          message: 'Which manager would you like to view the employees of?',
          choices: managerChoices,
        });

        const employeesByManager = await EmployeeQueries.getEmployeesByManager(
          managerSelection.managerId
        );
        console.table(employeesByManager[0]);
        break;
      case 'View Employees by Department':
        departments = await EmployeeQueries.getAllDepartments();
        departmentChoices = departments[0].map((department) => ({
          name: department.name,
          value: department.id,
        }));

        const departmentEmployeesSelection = await inquirer.prompt({
          type: 'list',
          name: 'departmentId',
          message: 'Which department would you like to view the employees of?',
          choices: departmentChoices,
        });

        const employeesByDepartment = await EmployeeQueries.getEmployeesByDepartment(
          departmentEmployeesSelection.departmentId
        );
        console.table(employeesByDepartment[0]);
        break;
      case 'Delete Department':
        // Fetch updated data before deleting a department
        departments = await EmployeeQueries.getAllDepartments();
        departmentChoices = departments[0].map((department) => ({
          name: department.name,
          value: department.id,
        }));

        const departmentSelection = await inquirer.prompt([
          {
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to delete:',
            choices: departmentChoices,
          },
        ]);

        await EmployeeQueries.deleteDepartment(departmentSelection.departmentId);

        console.log(`Department has been deleted.`);
        break;
      case 'Delete Role':
        // Fetch updated data before deleting a role
        roles = await EmployeeQueries.getAllRoles();
        roleChoices = roles[0].map((role) => ({
          name: role.title,
          value: role.id,
        }));

        const roleSelection = await inquirer.prompt([
          {
            type: 'list',
            name: 'roleId',
            message: 'Select a role to delete:',
            choices: roleChoices,
          },
        ]);

        await EmployeeQueries.deleteRole(roleSelection.roleId);

        console.log(`Role has been deleted.`);
        break;
      case 'Delete Employee':
        // Fetch updated data before deleting an employee
        employees = await EmployeeQueries.getAllEmployees();
        employeeChoices = employees[0].map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        const employeeSelection = await inquirer.prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to delete:',
            choices: employeeChoices,
          },
        ]);

        await EmployeeQueries.deleteEmployee(employeeSelection.employeeId);

        console.log(`Employee has been deleted.`);
        break;
      case 'View Department Budget':
        // Fetch updated data before viewing department budget
        departments = await EmployeeQueries.getAllDepartments();
        departmentChoices = departments[0].map((department) => ({
          name: department.name,
          value: department.id,
        }));

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
      case 'Exit':
        console.log('Goodbye!');
        return;
      default:
        console.log('Invalid choice');
    }
  }
}

main();