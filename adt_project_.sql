CREATE DATABASE StarbucksCRM;
USE StarbucksCRM;
-- Customers Table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age > 0),
    gender ENUM('Male', 'Female', 'Other'),
    income DECIMAL(10, 2) CHECK (income >= 0)
);

-- Stores Table
CREATE TABLE stores (
    store_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    manager_name VARCHAR(100)
);

-- Promotions Table
CREATE TABLE promotions (
    promo_id INT AUTO_INCREMENT PRIMARY KEY,
    promo_type VARCHAR(50),
    duration_days INT CHECK (duration_days > 0),
    reward DECIMAL(10, 2) CHECK (reward >= 0)
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    store_id INT,
    promo_id INT,
    transaction_date DATE NOT NULL,
    amount_spent DECIMAL(10, 2) CHECK (amount_spent >= 0),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    FOREIGN KEY (promo_id) REFERENCES promotions(promo_id)
);

-- Sample Data for Customers
INSERT INTO customers (name, age, gender, income)
VALUES ('Alice', 30, 'Female', 55000),
       ('Bob', 45, 'Male', 70000);

-- Sample Data for Stores
INSERT INTO stores (location, manager_name)
VALUES ('New York', 'Jane Doe'),
       ('Los Angeles', 'John Smith');

-- Sample Data for Promotions
INSERT INTO promotions (promo_type, duration_days, reward)
VALUES ('Discount', 10, 20.00),
       ('BOGO', 15, 50.00);

-- Sample Data for Transactions
INSERT INTO transactions (customer_id, store_id, promo_id, transaction_date, amount_spent)
VALUES (1, 1, 1, '2024-11-01', 120.50),
       (2, 2, 2, '2024-11-02', 200.00);
       
