-- Create Database
CREATE DATABASE IF NOT EXISTS EmployeeManagementSystem;
USE EmployeeManagementSystem;

-- Drop tables if they exist (for clean slate)
DROP TABLE IF EXISTS Payroll;
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Salary;

-- Create Salary Table
CREATE TABLE Salary (
    RoleCode VARCHAR(20) PRIMARY KEY,
    BaseSalary DECIMAL(10, 2)
);

-- Create Department Table
CREATE TABLE Department (
    DeptCode VARCHAR(10) PRIMARY KEY,
    DeptName VARCHAR(50),
    AssignedHR INT UNIQUE
);

-- Create Employee Table
CREATE TABLE Employee (
    EmpId INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Age INT,
    Address VARCHAR(200),
    PersonalEmail VARCHAR(100),
    Phone VARCHAR(15),
    workMail VARCHAR(100),
    password VARCHAR(255),
    RoleCode VARCHAR(20),
    DeptCode VARCHAR(10),
    FOREIGN KEY (RoleCode) REFERENCES Salary(RoleCode),
    FOREIGN KEY (DeptCode) REFERENCES Department(DeptCode)
);

-- Create Payroll Table
CREATE TABLE Payroll (
    EmpId INT PRIMARY KEY,
    DeptCode VARCHAR(10),
    Tax DECIMAL(10, 2),
    Allowances DECIMAL(10, 2),
    Incentive DECIMAL(10, 2),
    CTC DECIMAL(10, 2),
    FOREIGN KEY (EmpId) REFERENCES Employee(EmpId),
    FOREIGN KEY (DeptCode) REFERENCES Department(DeptCode)
);

-- Insert data into Salary Table
INSERT INTO Salary (RoleCode, BaseSalary) VALUES
('SDE-1', 14.00),
('SDE-2', 18.00),
('SDE-3', 22.00),
('M1', 24.00),
('M2', 30.00),
('M3', 28.00),
('L1', 10.00),
('L2', 14.00),
('L3', 16.00);

-- Insert data into Employee Table (30 employees with NULL DeptCode and RoleCode)
INSERT INTO Employee (EmpId, FirstName, LastName, Age, Address, PersonalEmail, Phone, workMail, password, RoleCode, DeptCode) VALUES
(101, 'Mayank', 'Polepalli Manohar', 28, '123 Maple St, Bangalore', 'mayank.pm@gmail.com', '9876543210', NULL, NULL, NULL, NULL),
(102, 'Thathva', 'Bannur Rayappa Gowda', 27, '456 Oak Ave, Bangalore', 'thathva.gowda@gmail.com', '9876543211', NULL, NULL, NULL, NULL),
(103, 'Rudresh', 'Prakash', 29, '789 Pine Rd, Bangalore', 'rudresh.prakash@gmail.com', '9876543212', NULL, NULL, NULL, NULL),
(104, 'Rahul', 'Krishnan Ravindran', 26, '321 Elm St, Bangalore', 'rahul.krishnan@gmail.com', '9876543213', NULL, NULL, NULL, NULL),
(105, 'Sayeed', 'Unnisa', 32, '654 Birch Ln, Bangalore', 'sayeed.unnisa@gmail.com', '9876543214', NULL, NULL, NULL, NULL),
(106, 'Abhijeet', 'Yadav', 25, '987 Cedar Dr, Bangalore', 'abhijeet.yadav@gmail.com', '9876543215', NULL, NULL, NULL, NULL),
(107, 'Bhuvan', 'Raju', 28, '147 Spruce Way, Bangalore', 'bhuvan.raju@gmail.com', '9876543216', NULL, NULL, NULL, NULL),
(108, 'Abhishek', 'Kumar', 27, '258 Willow Ct, Bangalore', 'abhishek.kumar@gmail.com', '9876543217', NULL, NULL, NULL, NULL),
(109, 'Chandan', 'Eswaraiah', 30, '369 Ash Blvd, Bangalore', 'chandan.eswaraiah@gmail.com', '9876543218', NULL, NULL, NULL, NULL),
(110, 'Shresht', 'Gunashekhar', 26, '741 Poplar St, Bangalore', 'shresht.g@gmail.com', '9876543219', NULL, NULL, NULL, NULL),
(111, 'Rahul', 'Saraswat', 29, '852 Fir Ave, Bangalore', 'rahul.saraswat@gmail.com', '9876543220', NULL, NULL, NULL, NULL),
(112, 'Dhruv', 'Akshay Kadam', 25, '963 Hemlock Rd, Bangalore', 'dhruv.kadam@gmail.com', '9876543221', NULL, NULL, NULL, NULL),
(113, 'Prem', 'Singh Sengar', 28, '159 Cypress Ln, Bangalore', 'prem.sengar@gmail.com', '9876543222', NULL, NULL, NULL, NULL),
(114, 'Mudit', 'Mohan', 27, '357 Magnolia Dr, Bangalore', 'mudit.mohan@gmail.com', '9876543223', NULL, NULL, NULL, NULL),
(115, 'Kirti', 'Sudha Sahoo', 26, '468 Dogwood Way, Bangalore', 'kirti.sahoo@gmail.com', '9876543224', NULL, NULL, NULL, NULL),
(116, 'Sanketha', 'Billodi Thimanna', 29, '579 Redwood Ct, Bangalore', 'sanketha.billodi@gmail.com', '9876543225', NULL, NULL, NULL, NULL),
(117, 'Ankit', 'Sreenivasa', 28, '680 Sequoia Blvd, Bangalore', 'ankit.sreenivasa@gmail.com', '9876543226', NULL, NULL, NULL, NULL),
(118, 'Shravya', 'Bheemashankara Rao', 30, '791 Palm St, Bangalore', 'shravya.rao@gmail.com', '9876543227', NULL, NULL, NULL, NULL),
(119, 'Poluru', 'Vamsi', 27, '802 Beech Ave, Bangalore', 'poluru.vamsi@gmail.com', '9876543228', NULL, NULL, NULL, NULL),
(120, 'Shahid', 'Ahamed', 31, '913 Cherry Rd, Bangalore', 'shahid.ahamed@gmail.com', '9876543229', NULL, NULL, NULL, NULL),
(121, 'Subhranil', 'Das', 28, '024 Walnut Ln, Bangalore', 'subhranil.das@gmail.com', '9876543230', NULL, NULL, NULL, NULL),
(122, 'Rakshitha', 'Didaga Nageswara Rao', 26, '135 Hickory Dr, Bangalore', 'rakshitha.rao@gmail.com', '9876543231', NULL, NULL, NULL, NULL),
(123, 'Charuka', 'Shree Raja', 29, '246 Sycamore Way, Bangalore', 'charuka.raja@gmail.com', '9876543232', NULL, NULL, NULL, NULL),
(124, 'Sagar', 'Patil', 27, '357 Alder Ct, Bangalore', 'sagar.patil@gmail.com', '9876543233', NULL, NULL, NULL, NULL),
(125, 'Priya', 'Sharma', 25, '468 Juniper Blvd, Bangalore', 'priya.sharma@gmail.com', '9876543234', NULL, NULL, NULL, NULL),
(126, 'Vikram', 'Singh', 30, '579 Locust St, Bangalore', 'vikram.singh@gmail.com', '9876543235', NULL, NULL, NULL, NULL),
(127, 'Neha', 'Reddy', 28, '680 Pecan Ave, Bangalore', 'neha.reddy@gmail.com', '9876543236', NULL, NULL, NULL, NULL),
(128, 'Arjun', 'Mehta', 26, '791 Chestnut Rd, Bangalore', 'arjun.mehta@gmail.com', '9876543237', NULL, NULL, NULL, NULL),
(129, 'Sneha', 'Gupta', 29, '802 Acacia Ln, Bangalore', 'sneha.gupta@gmail.com', '9876543238', NULL, NULL, NULL, NULL),
(130, 'Karthik', 'Iyer', 27, '913 Yew Dr, Bangalore', 'karthik.iyer@gmail.com', '9876543239', NULL, NULL, NULL, NULL);

-- Insert data into Department Table (4 departments, each with 1 unique HR - NO VALUES YET)
-- Insert data into Department Table (4 departments, each with 1 unique HR)
INSERT INTO Department (DeptCode, DeptName, AssignedHR) VALUES
('HR', 'Human Resources', 105),        -- Sayeed Unnisa (will be L3 HR)
('PSO', 'Pre-Sales Operations', 106),   -- Abhijeet Yadav (will be L2 HR)
('CSO', 'Customer Success Operations', 107), -- Bhuvan Raju (will be L1 HR)
('R&D', 'Research & Development', 108); -- Abhishek Kumar (will be L2 HR)

-- Insert data into Payroll Table (30 entries with NULL Tax, Allowances, Incentive, CTC)
INSERT INTO Payroll (EmpId, DeptCode, Tax, Allowances, Incentive, CTC) VALUES
(101, NULL, NULL, NULL, NULL, NULL),
(102, NULL, NULL, NULL, NULL, NULL),
(103, NULL, NULL, NULL, NULL, NULL),
(104, NULL, NULL, NULL, NULL, NULL),
(105, NULL, NULL, NULL, NULL, NULL),
(106, NULL, NULL, NULL, NULL, NULL),
(107, NULL, NULL, NULL, NULL, NULL),
(108, NULL, NULL, NULL, NULL, NULL),
(109, NULL, NULL, NULL, NULL, NULL),
(110, NULL, NULL, NULL, NULL, NULL),
(111, NULL, NULL, NULL, NULL, NULL),
(112, NULL, NULL, NULL, NULL, NULL),
(113, NULL, NULL, NULL, NULL, NULL),
(114, NULL, NULL, NULL, NULL, NULL),
(115, NULL, NULL, NULL, NULL, NULL),
(116, NULL, NULL, NULL, NULL, NULL),
(117, NULL, NULL, NULL, NULL, NULL),
(118, NULL, NULL, NULL, NULL, NULL),
(119, NULL, NULL, NULL, NULL, NULL),
(120, NULL, NULL, NULL, NULL, NULL),
(121, NULL, NULL, NULL, NULL, NULL),
(122, NULL, NULL, NULL, NULL, NULL),
(123, NULL, NULL, NULL, NULL, NULL),
(124, NULL, NULL, NULL, NULL, NULL),
(125, NULL, NULL, NULL, NULL, NULL),
(126, NULL, NULL, NULL, NULL, NULL),
(127, NULL, NULL, NULL, NULL, NULL),
(128, NULL, NULL, NULL, NULL, NULL),
(129, NULL, NULL, NULL, NULL, NULL),
(130, NULL, NULL, NULL, NULL, NULL);

-- Display all tables
SELECT 'Salary Table' AS TableName;
SELECT * FROM Salary;

SELECT 'Department Table' AS TableName;
SELECT * FROM Department;

SELECT 'Employee Table (First 10)' AS TableName;
SELECT * FROM Employee LIMIT 10;

SELECT 'Payroll Table (First 10)' AS TableName;
SELECT * FROM Payroll LIMIT 10;