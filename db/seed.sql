USE companyemployee_db;

INSERT INTO department
(name)
VALUES
("Management"),
("Human Resources"),
("Tech"),
("Legal"),
("Sales");

INSERT INTO role
(title,
salary,
department_id)
VALUES
("Manager", "200000.50", 1),
("HR Specialist", "55000.80", 2),
("Legal Advisor", "100000.50", 4),
(" Software Engineer", "125000.30", 3),
("Salesman", "105000.10", 5);

INSERT INTO employee
(first_name,
last_name,
role_id,
manager_id)
VALUES
("Nikola", "Jokic", 1, NULL),
("Jamal", "Murray", 1, NULL),
("Monte", "Morris", 3, 1),
("Paul", "Milsap", 5, 2),
("Aaron", "Gordon", 4, 2),
("Michael", "Porter", 2, 1);