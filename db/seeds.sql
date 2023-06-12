-- SEED TABLE departments
INSERT INTO departments (name)
VALUES ("Information Technology"),
("Human Resources"),
("User Experience/User Interface"),
("Marketing"),
("Accounting and Finances"),
("Business Development"),
("Board of Directors");
    

-- SEED TABLE roles
INSERT INTO roles (title, salary, department_id)
VALUES ("Human Resources Specialist", 75000, 2),
("Marketing Specialist", 65000, 4),
("Information Technology Specialist", 75000, 1),
("Accounting and Finance Specialist", 55000, 5),
("Business Development Specialist", 55000, 6),
("Board Member", 150000, 7),
("Full Stack Developer", 85000, 3),
("Back End Developer", 70000, 3),
("Front End Developer", 60000, 3);
       
-- SEED TABLE employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Dirt", 1, 5),
("Stacy", "Dale", 2, 6),
("Jonathan", "Skurdle", 1, 6),
("Eliza", "Ishel", 3, 2),
("Stephanie", "Gloss", 7, 5),
("Ezekiel", "Dolemy", 5, 2),
("Sharnel", "Elnas", 3, 4),
("Bartholemew", "Effense", 4, 3),
("Romel", "Dulfance", 7, 2),
("Tykus", "Flor", 2, 1);
       