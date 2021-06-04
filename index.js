const mysql = require('mysql');
const inquirer = require('inquirer');

// Setting connection to local host
const connection = mysql.createConnection({
  host: 'localhost',

  // Setting port to 3000
  port: process.env.PORT || 3000,

  // SQL username  
  user: 'root',

  // SQL password and database 
  password: 'root',
  database: 'company_employeeDB',
});

// Initial prompt 
function init() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'task',
      message: 'What would you like to do?',
      choices: ['Add a new department', 'Add a new role', 'Add a new employee', 'View all employees', 'View all departments', 'View all roles', 'Update an employees role']
    },
  ])
    .then((data) => {
      switch (data.task) {
        case 'Add a new department':
          createDepartment();
          break;

        case 'Add a new role':
          createRole();
          break;

        case 'Add a new employee':
          createEmployee();
          break;

        case 'View all employees':
          readEmployee();
          break;

        case 'View all departments':
          readDepartment();
          break;

        case 'View all roles':
          readRole();
          break;

        case 'Update an employees role':
          updateEmployeeRole();
          break;

        default:
          console.log(`Invalid action: ${data.task}`);
          break;
      }
    })
};

// Create a new department
createDepartment = () => {
  console.log('\nCreating a new department...\n');
  inquirer.prompt([
    {
      type: 'input',
      name: 'newDepartment',
      message: 'What is the name of the new department?',
    },
  ])
    .then((data) => {
      connection.query('INSERT INTO department SET ? ',
        {
          name: `${data.newDepartment}`,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} department created!\n`)
          init();
        }
      );
    })
};

// Create a new role 
createRole = () => {
  console.log('\nCreating a new role...\n');

  const departments = [];

  connection.query('SELECT * FROM department ', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, name }) => {
      departments.push(
        {
          name: `${name}`,
          value: `${id}`
        })
    })
  });

  inquirer.prompt([
    {
      type: 'input',
      name: 'newRole',
      message: 'What is the new role?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of this role?',
    },
    {
      type: 'list',
      name: 'departmentID',
      message: 'Which department is this role in?',
      choices: departments
    },
  ])
    .then((data) => {
      connection.query('INSERT INTO role SET ? ',
        {
          title: `${data.newRole}`,
          salary: `${data.salary}`,
          department_id: `${data.departmentID}`,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} role created!\n`)
          init();
        }
      );
    })

};

// Create a new employee
createEmployee = () => {
  console.log('\nCreating a new employee...\n');

  const roles = [];
  const managers = [
    {
      name: 'None',
      value: 0
    }
  ];

  connection.query('SELECT * FROM role ', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, title }) => {
      roles.push(
        {
          name: `${title}`,
          value: `${id}`
        })
    })
  });

  let query =
    'SELECT employee.id, employee.first_name, employee.last_name ';
  query +=
    'FROM employee INNER JOIN role ON (employee.role_id = role.id)';
  query +=
    'WHERE (role.title = "Manager")';
  connection.query(query, (err, res) => {
    if (err) throw err;
    res.forEach(({ id, first_name, last_name }) => {
      managers.push(
        {
          name: `${first_name} ${last_name}`,
          value: `${id}`
        })
    })
  });


  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employees first name?',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employees last name?',
    },
    {
      type: 'list',
      name: 'roleID',
      message: 'Which role does this employee hold?',
      choices: roles
    },
    {
      type: 'list',
      name: 'managerID',
      message: 'Who is the manager of this employee?',
      choices: managers
    },
  ])
    .then((data) => {
      if (data.managerID == 0) {
        connection.query('INSERT INTO employee SET ? ',
          {
            first_name: `${data.firstName}`,
            last_name: `${data.lastName}`,
            role_id: `${data.roleID}`,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee created!\n`);
            init();
          }
        );
      } else {
        connection.query('INSERT INTO employee SET ? ',
          {
            first_name: `${data.firstName}`,
            last_name: `${data.lastName}`,
            role_id: `${data.roleID}`,
            manager_id: `${data.managerID}`,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee created!\n`);
            init();
          }
        );
      }
    })
};

// Getting departments
readDepartment = () => {
  console.log('\nGetting all departments...\n');
  connection.query('SELECT * FROM department ', (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  }
  );
}

// Getting roles
readRole = () => {
  console.log('\nGetting all roles...\n');

  let query =
    'SELECT role.id, role.title, role.salary, department.name AS department ';
  query +=
    'FROM (role INNER JOIN department ON role.department_id = department.id) ';
  query +=
    'ORDER BY role.id ASC ';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  }
  );
}

// Getting employees
readEmployee = () => {
  console.log('\nGetting all employees...\n');

  let query =
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department ';
  query +=
    'FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id) ';
  query +=
    'ORDER BY employee.id ASC ';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  }
  );
};

// Update employee role
updateEmployeeRole = () => {
  console.log('\nUpdating employee...\n');

  const employees = [];
  const role = [];

  connection.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee ', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, first_name, last_name }) => {
      employees.push(
        {
          name: `${first_name} ${last_name}`,
          value: `${id}`
        })
    })
  });

  let query = 'SELECT role.id, role.title FROM role';
  connection.query(query, (err, res) => {
    if (err) throw err;
    res.forEach(({ id, title }) => {
      role.push(
        {
          name: `${title}`,
          value: `${id}`
        })
    })
  });

  inquirer.prompt([
    {
      type: 'list',
      name: 'confirm',
      message: 'Are you sure youd like to update an employee?',
      choices: ['Yes', 'No']
    },
  ])
    .then((data) => {
      if (data.confirm === 'No') {
        init()
      } else {
        inquirer.prompt([
          {
            type: 'list',
            name: 'updatedEmployee',
            message: 'Which employee would you like to update?',
            choices: employees
          },
          {
            type: 'list',
            name: 'updatedRole',
            message: 'What is the employees new role?',
            choices: role
          },
        ])
          .then((data) => {
            connection.query('UPDATE employee SET ? WHERE ? ',
              [
                {
                  role_id: data.updatedRole,
                },
                {
                  id: data.updatedEmployee,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} employee updated!\n`);
                init();
              }
            );
          })
      }
    })
}

// Connection 
connection.connect((err) => {
  if (err) throw err;
  console.log(`Connection made on PORT: ${connection.threadId}\n`)
  init();
});