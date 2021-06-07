//required dev dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

//standard connection creation 
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'companyemployee_db',
});

//initial connection - which is set to call the init function and kick things off
connection.connect((err) => {
    if (err) throw err;

    console.log(`connected as id ${connection.threadId}`);

    init();
});

//using an editable array for prompts
const options = ['Add a new department', 'Add a new role', 'Add a new Employee', 'View Current Departments', 'View Current Roles', 'View Current Employees', 'Change Employee role', 'I am finished'];

//init function which prompts the user for what action they would like to take.
function init() {
    console.log('\n');

    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                choices: options,
                name: 'init',
            },
        ])
        .then((response) => {
            //switch statement used to route function calls based on response selected
            switch (response.init) {
                case 'Add a new department':
                    newDept();
                    break;
                case 'Add a new role':
                    newRole();
                    break;
                case 'Add a new Employee':
                    newEmp();
                    break;
                case 'View Current Departments':
                    viewDept();
                    break;
                case 'View Current Roles':
                    viewRole();
                    break;
                case 'View Current Employees':
                    viewEmployees();
                    break;
                case 'Change Employee role':
                    changeRole();
                    break;
                default:
                    connection.end();
                    break;
            };
        });
};

//new department fucntion that takes input from user and adds a new department into the department table. once complete it calls in the init function to prompt the user for what they want to do next
const newDept = () => {
    console.log('\n');

    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the Department you are adding?',
                name: 'newDept',
            }
        ])
        .then((response) => {
            console.log(response.newDept);
            connection.query('INSERT INTO department SET ?',
                {
                    dep_name: response.newDept,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n${res.affectedRows} new Department inserted!\n`);
                    init();
                }
            )
        })
};

//new role function that takes input from the user and adds the new role into the emp_role table. once complete it calls in the init function to prompt the user for what they want to do next
const newRole = () => {
    console.log('\n');

    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the role you are adding?',
                name: 'newRole',
            },
            {
                type: 'input',
                message: 'What is the salary for this role',
                name: 'salary',
            },
            {
                type: 'input',
                message: 'What is the department ID for this role?',
                name: 'deptID',
            }
        ])
        .then((response) => {

            connection.query('INSERT INTO emp_role SET ?',
                {
                    role_title: response.newRole,
                    salary: response.salary,
                    department_id: response.deptID,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n${res.affectedRows} new role inserted!\n`);
                    init();
                }
            )
        })

};

//new role function that takes input from the user and adds the new employee into the employee table. once complete it calls in the init function to prompt the user for what they want to do next
const newEmp = () => {
    console.log('\n');
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the fist name of the Emplopee you are adding?',
                name: 'firstName',
            },
            {
                type: 'input',
                message: 'What is the last name of the Employee you are adding?',
                name: 'lastName',
            },
            {
                type: 'input',
                message: 'What is this employees role ID?',
                name: 'empRoleId',
            },
            {
                type: 'input',
                message: 'What is this employees Managers ID?',
                name: 'empManId',
            }
        ])
        .then((response) => {

            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.empRoleId,
                    manager_id: response.empManId,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n${res.affectedRows} New employee added!\n`);
                    init();
                }
            )
        })

};

//view department function which simply queries the department table and returns all data
const viewDept = () => {
    console.log('\n');
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

//view role function which simply queries the emp_role table and returns all data
const viewRole = () => {
    console.log(`\n`);
    connection.query('SELECT * FROM emp_role', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

//view employee function which simply queries the employee table and returns all data
const viewEmployees = () => {
    console.log(`\n`);
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

//change role function first queries the employee table and returns first and last name. then creates a concatenated name which the user selects to update the role. once the name is selected the user is prompted to assing a new role ID. the name is then split and the first name is used to match against the table and update the role. once complete it calls in the init function to prompt the user for what they want to do next
const changeRole = () => {
    const concatName = [];
    connection.query('SELECT first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        //for loop that is concatenating the first and last name and pushing to a new array that is used for the employee update selection
        for (let i = 0; i < res.length; i++) {
            concatName.push(res[i].first_name + " " + res[i].last_name);
        };
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to change the role for?',
                    choices: concatName,
                    name: 'roleChangEmp',
                },
                {
                    type: 'input',
                    message: 'What is the new Role ID?',
                    name: 'newRoleId',
                }
            ])
            .then((response) => {
                //splitting the names apart to be used for matching
                const name = response.roleChangEmp.split(' ');

                connection.query('UPDATE employee SET ? WHERE ?',
                    [
                        {
                            role_id: response.newRoleId,
                        },
                        {
                            first_name: name[0],
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;

                        console.log(`\n${res.affectedRows} role's updated!\n`);

                        init();
                    })
            })
    })
};