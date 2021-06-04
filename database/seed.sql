USE company_employeeDB;

INSERT INTO department
(name)
VALUES
("Administration"),
("Human Resources"),
("Development"),
("Legal"),
("Maintenance");

INSERT INTO role
(title,
salary,
department_id)
VALUES
("Manager", "101000.50", 1),
("HR Specialist", "67000.80", 2),
("Legal Advisor", "90000.50", 4),
("Engineer", "88500.30", 3),
("Custodian", "45000.10", 5);

INSERT INTO employee
(first_name,
last_name,
role_id,
manager_id)
VALUES
("Sarah", "Snow", 1, NULL),
("Natalie", "Sanchez", 1, NULL),
("Richard", "Smith", 3, 1),
("Aliza", "Edwards", 5, 2),
("Peter", "Pan", 4, 2),
("Daniel", "Davidson", 2, 1);