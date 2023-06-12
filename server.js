const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const fetch = require("node-fetch");
var Table = require('cli-table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

class EmployeeTracker {
    constructor() { };
    apiCall = (task) => {
        if (task === 'view-departments' || task === 'view-roles' || task === 'view-employees') {
            console.log(task);
            fetch('http://localhost:3001/api/' + task, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                // Process the data
                let headers = Object.keys(data[0]);
                let table = new Table({ head: headers});
                for (let datum of data) {
                    let dataValues = [];
                    for (let key of Object.keys(datum)) {
                        dataValues.push(datum[key]);
                    }
                    table.push(dataValues);
                }
                console.log("\n" + table.toString());
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
        }
    }
    performAction = (task) => {
        this.apiCall(task);
    }
    taskPrompt = () => {
        const questions = [
            {
                type: 'list',
                message: 'What task would you like to perform?',
                name: 'task',
                choices: [
                    {
                        name: 'View All Departments',
                        value: 'view-departments'
                    },
                    {
                        name: 'View All Roles',
                        value: 'view-roles',
                    },
                    {
                        name: 'View All Employees',
                        value: 'view-employees'
                    },
                    {
                        name: 'Add a Department',
                        value: 'add-department',
                    },
                    {
                        name: 'Add a Role',
                        value: 'add-role'
                    },
                    {
                        name: 'Add an Employee',
                        value: 'add-employee'
                    },
                    {
                        name: 'Update an Employee Role',
                        value: 'update-employee-role'
                    }
                ]
            },
        ];
        inquirer
            .prompt(questions)
            .then((response) => {
                console.log("\n");
                console.log(this.performAction(response.task));
                this.taskPrompt();
            })
    }
}
  
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'sqlpassword',
        database: 'employees_db'
    },
    console.log(`Connected to the movies_db database.`)
);

// View all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

app.get('/api/view-departments', (req, res) => {
    db.query('SELECT * FROM departments;', (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

app.get('/api/view-roles', (req, res) => {
    db.query('SELECT * FROM roles;',
        (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
app.get('/api/view-employees', (req, res) => {
    db.query('SELECT * FROM employees;',
        (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
app.post('/api/add-department', (req, res) => {
    db.query(`INSERT INTO departments (name) VALUES (?);`,
        req.body.department,
        (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
app.post('/api/add-role', (req, res) => {
    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`,
        [req.body.title, req.body.salary,
        req.body.department_id], (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
app.post('/api/add-employee', (req, res) => {
    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
        [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id],
        (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

app.post('/api/update-employee-role', (req, res) => {
    db.query(`UPDATE employees SET role_id=? WHERE id = ?;`,
        [req.body.role_id, req.body.id],
        (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Initialize application.
    console.log(`
 _______  __   __  _______  ___      _______  __   __  _______  _______ 
|       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |
|    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|
|   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___ 
|    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|
|   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___ 
|_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|
     _______  ______    _______  _______  ___   _  _______  ______      
    |       ||    _ |  |   _   ||       ||   | | ||       ||    _ |     
    |_     _||   | ||  |  |_|  ||       ||   |_| ||    ___||   | ||     
      |   |  |   |_||_ |       ||       ||      _||   |___ |   |_||_    
      |   |  |    __  ||       ||      _||     |_ |    ___||    __  |   
      |   |  |   |  | ||   _   ||     |_ |    _  ||   |___ |   |  | |   
      |___|  |___|  |_||__| |__||_______||___| |_||_______||___|  |_|   
`)
    const tracker = new EmployeeTracker();
    tracker.taskPrompt(); 
  
});
