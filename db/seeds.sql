-- Insert sample departments
INSERT INTO departments (name) 
VALUES  ('HR'),
        ('Sales'),
        ('Engineering');

-- Insert sample roles
INSERT INTO roles (title, salary, department_id)
VALUES  ('Manager', 60000, 1),
        ('Sales Representative', 50000, 2),
        ('Software Engineer', 70000, 3);

-- Insert sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1, NULL),
        ('Jane', 'Smith', 2, 1),
        ('Bob', 'Johnson', 3, 1);