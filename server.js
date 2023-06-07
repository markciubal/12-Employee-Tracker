const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
    db.query('SELECT * FROM roles;', (error, results) => {
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
    db.query('SELECT * FROM employees;', (error, results) => {
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
    console.log(req.body.department);
    db.query(`INSERT INTO departments (name) VALUES (?);`, req.body.department, (error, results) => {
        
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
    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`, [req.body.title, req.body.salary, req.body.department_id], (error, results) => {
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
    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id], (error, results) => {
        if (error) {
            res.status(401).json(error);
        } else {
            res.json(results)
        }    
    });
});

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
