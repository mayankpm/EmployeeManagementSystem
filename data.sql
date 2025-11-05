
DROP DATABASE IF EXISTS EmployeeManagementSystem;
CREATE DATABASE EmployeeManagementSystem;
USE EmployeeManagementSystem;

CREATE TABLE department (
  DeptCode varchar(10) NOT NULL,
  DeptName varchar(50) DEFAULT NULL,
  AssignedHR int DEFAULT NULL,
  PRIMARY KEY (DeptCode),
  UNIQUE KEY AssignedHR (AssignedHR)
);

CREATE TABLE employee (
  EmpId int NOT NULL AUTO_INCREMENT,
  FirstName varchar(50) DEFAULT NULL,
  LastName varchar(50) DEFAULT NULL,
  Age int DEFAULT NULL,
  Address varchar(200) DEFAULT NULL,
  PersonalEmail varchar(100) DEFAULT NULL,
  Phone varchar(15) DEFAULT NULL,
  workMail varchar(100) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  RoleCode varchar(20) DEFAULT NULL,
  DeptCode varchar(10) DEFAULT NULL,
  approval_status varchar(20) DEFAULT 'UNDEFINED',
  PRIMARY KEY (EmpId),
  KEY RoleCode (RoleCode),
  KEY DeptCode (DeptCode)
);

CREATE TABLE payroll (
  EmpId int NOT NULL,
  DeptCode varchar(10) DEFAULT NULL,
  Tax decimal(10,2) DEFAULT NULL,
  Allowances decimal(10,2) DEFAULT NULL,
  Incentive decimal(10,2) DEFAULT NULL,
  CTC decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (EmpId),
  KEY DeptCode (DeptCode)
);

CREATE TABLE salary (
  RoleCode varchar(20) NOT NULL,
  BaseSalary decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (RoleCode)
);

INSERT INTO department (DeptCode, DeptName, AssignedHR) VALUES
('ADM','Administration',NULL),
('CSO','Customer Success Operations',103),
('DD','Dev Ops',567),
('PSO','Pre-Sales Operations',133),
('R&D','Research & Development',134);

INSERT INTO employee (EmpId, FirstName, LastName, Age, Address, PersonalEmail, Phone, workMail, password, RoleCode, DeptCode, approval_status) VALUES
(100,'Admin','User',32,'Admin Office, Bangalore',NULL,'88888888888','admin@company.com','Admin@123','ADM','ADM','APPROVED'),
(101,'Mayank','Polepalli Manohar',22,'123 Maple St, Bangalore',NULL,'9876543210','mayank.pm@gmail.com','Mayank@12345','M2','PSO','UNDEFINED'),
(102,'Thathva','Bannur Rayappa Gowda',22,'456 Oak Ave, Bangalore',NULL,'9876543211','thathva.gowda@gmail.com',NULL,'L3','CSO','DECLINED'),
(103,'Rudresh','Prakash',29,'789 Pine Rd, Bangalore',NULL,'9876543212','rudresh.prakash@gmail.com','Rudresh@123','HR','CSO','APPROVED'),
(104,'Rahul','Krishnan Ravindran',26,'321 Elm St, Bangalore',NULL,'9876543213','rahul.krishnan@gmail.com','RahulK@123','SDE-3','PSO','APPROVED'),
(105,'Sayeed','Unnisa',32,'654 Birch Ln, Bangalore',NULL,'9876543214','sayeed.unnisa@gmail.com','Sayeed@123','SDE-3','CSO','APPROVED'),
(106,'Abhijeet','Yadav',25,'987 Cedar Dr, Bangalore',NULL,'9876543215','abhijeet.yadav@gmail.com','Abhijeet@123','M2','R&D','UNDEFINED'),
(107,'Bhuvan','Raju',28,'147 Spruce Way, Bangalore',NULL,'9876543216','bhuvan.raju@gmail.com','Bhuvan@123','M3','PSO','DECLINED'),
(108,'Abhishek','Kumar',27,'258 Willow Ct, Bangalore',NULL,'9876543217','abhishek.kumar@gmail.com','Abhishek@123','M2','R&D','APPROVED'),
(109,'Chandan','Eswaraiah',30,'369 Ash Blvd, Bangalore',NULL,'9876543218','chandan.eswaraiah@gmail.com','Chandan@123','SDE-2','PSO','UNDEFINED'),
(110,'Shresht','Gunashekhar',26,'741 Poplar St, Bangalore',NULL,'9876543219','shresht.g@gmail.com','Shresht@123','L2','PSO','UNDEFINED'),
(111,'Rahul','Saraswat',29,'852 Fir Ave, Bangalore',NULL,'9876543220','rahul.saraswat@gmail.com','RahulS@123','SDE-1','R&D','DECLINED'),
(112,'Dhruv','Akshay Kadam',25,'963 Hemlock Rd, Bangalore',NULL,'9876543221','dhruv.kadam@gmail.com','Dhruv@123','SDE-2','CSO','UNDEFINED'),
(113,'Prem','Singh Sengar',28,'159 Cypress Ln, Bangalore',NULL,'9876543222','prem.sengar@gmail.com','Prem@123','SDE-3','PSO','UNDEFINED'),
(114,'Mudit','Mohan',27,'357 Magnolia Dr, Bangalore',NULL,'9876543223','mudit.mohan@gmail.com','Mudit@123','SDE-2','PSO','UNDEFINED'),
(115,'Kirti','Sudha Sahoo',26,'468 Dogwood Way, Bangalore',NULL,'9876543224','kirti.sahoo@gmail.com','Kirti@123','M3','R&D','UNDEFINED'),
(116,'Sanketha','Billodi Thimanna',29,'579 Redwood Ct, Bangalore',NULL,'9876543225','sanketha.billodi@gmail.com','Sanketha@123','M3','PSO','UNDEFINED'),
(117,'Ankit','Sreenivasa',28,'680 Sequoia Blvd, Bangalore',NULL,'9876543226','ankit.sreenivasa@gmail.com','Ankit@123','SDE-2','PSO','UNDEFINED'),
(118,'Shravya','Bheemashankara Rao',30,'791 Palm St, Bangalore',NULL,'9876543227','shravya.rao@gmail.com','Shravya@123','L3','CSO','APPROVED'),
(119,'Poluru','Vamsi',27,'802 Beech Ave, Bangalore',NULL,'9876543228','poluru.vamsi@gmail.com','Poluru@123','M3','PSO','UNDEFINED'),
(120,'Shahid','Ahamed',31,'913 Cherry Rd, Bangalore',NULL,'9876543229','shahid.ahamed@gmail.com','Shahid@123','SDE-1','PSO','UNDEFINED'),
(121,'Subhranil','Das',28,'024 Walnut Ln, Bangalore',NULL,'9876543230','subhranil.das@gmail.com','Subhranil@123','M3','CSO','DECLINED'),
(122,'Rakshitha','Didaga Nageswara Rao',26,'135 Hickory Dr, Bangalore',NULL,'9876543231','rakshitha.rao@gmail.com','Rakshitha@123','M1','PSO','UNDEFINED'),
(123,'Charuka','Shree Raja',29,'246 Sycamore Way, Bangalore',NULL,'9876543232','charuka.raja@gmail.com','Charuka@123','L2','R&D','UNDEFINED'),
(124,'Sagar','Patil',27,'357 Alder Ct, Bangalore',NULL,'9876543233','sagar.patil@gmail.com','Sagar@123','M3','PSO','UNDEFINED'),
(125,'Priya','Sharma',25,'468 Juniper Blvd, Bangalore',NULL,'9876543234','priya.sharma@gmail.com','Priya@123','SDE-2','CSO','DECLINED'),
(126,'Vikram','Singh',30,'579 Locust St, Bangalore',NULL,'9876543235','vikram.singh@gmail.com','Vikram@123','L1','R&D','UNDEFINED'),
(127,'Neha','Reddy',28,'680 Pecan Ave, Bangalore',NULL,'9876543236','neha.reddy@gmail.com','Neha@123','L3','R&D','UNDEFINED'),
(128,'Arjun','Mehta',26,'791 Chestnut Rd, Bangalore',NULL,'9876543237','arjun.mehta@gmail.com','Arjun@123','L1','PSO','UNDEFINED'),
(129,'Sneha','Gupta',29,'802 Acacia Ln, Bangalore',NULL,'9876543238','sneha.gupta@gmail.com','Sneha@123','SDE-2','R&D','UNDEFINED'),
(130,'Karthik','Iyer',27,'913 Yew Dr, Bangalore',NULL,'9876543239','karthik.iyer@gmail.com','Karthik@123','L3','PSO','UNDEFINED'),
(131,'Hello','World',66,'acbasd',NULL,'1052786559','hello@hello.com','Hello@123','HR','R&D','DECLINED'),
(133,'BRAPT','Q',22,'braptq',NULL,'1234567890','braptq@gmail.com','Blab@123','HR','PSO','APPROVED'),
(134,'blab','blab',23,'qwertyuiop',NULL,'1234567890','thathvabr18@gmail.com','Qwerty@123','HR','R&D','APPROVED'),
(136,'Rohith','Kumar',23,'Banglaore',NULL,'8096635662',NULL,'123456','SDE-1','R&D','APPROVED'),
(141,'Mayank','User',23,'852 Fir Ave, Bangalore',NULL,'1234567890','fhshisback@gmail.com','CGvn4RUm6v','SDE-2','CSO','APPROVED');

INSERT INTO payroll (EmpId, DeptCode, Tax, Allowances, Incentive, CTC) VALUES
(101,NULL,1000.00,2000.00,500.00,1500.00),
(102,NULL,1500.00,2500.00,800.00,1800.00),
(103,NULL,1200.00,2200.00,700.00,1700.00),
(104,NULL,1100.00,2100.00,900.00,1900.00),
(105,NULL,900.00,2000.00,700.00,1800.00),
(106,NULL,950.00,2050.00,750.00,1850.00),
(107,NULL,1300.00,2400.00,800.00,1900.00),
(108,NULL,1350.00,2500.00,850.00,2000.00),
(109,NULL,1250.00,2300.00,700.00,1750.00),
(110,NULL,1450.00,2600.00,850.00,2050.00),
(111,NULL,1400.00,2550.00,900.00,2050.00),
(112,NULL,1600.00,2700.00,950.00,2050.00),
(113,NULL,1650.00,2750.00,1000.00,2100.00),
(114,NULL,1700.00,2800.00,1050.00,2150.00),
(115,NULL,1750.00,2850.00,1100.00,2200.00),
(116,NULL,1800.00,2900.00,1150.00,2250.00),
(117,NULL,2000.00,3100.00,1200.00,2300.00),
(118,NULL,2100.00,3200.00,1250.00,2350.00),
(119,NULL,2200.00,3300.00,1300.00,2400.00),
(120,NULL,2300.00,3400.00,1350.00,2450.00),
(121,NULL,2400.00,3500.00,1400.00,2500.00),
(122,NULL,2500.00,3600.00,1450.00,2550.00),
(123,NULL,2600.00,3700.00,1500.00,2600.00),
(124,NULL,2700.00,3800.00,1550.00,2650.00),
(125,NULL,2800.00,3900.00,1600.00,2700.00),
(126,NULL,2900.00,4000.00,1650.00,2750.00),
(127,NULL,3000.00,4100.00,1700.00,2800.00),
(128,NULL,3100.00,4200.00,1750.00,2850.00),
(129,NULL,3200.00,4300.00,1800.00,2900.00),
(130,NULL,3300.00,4400.00,1850.00,2950.00);

INSERT INTO salary (RoleCode, BaseSalary) VALUES
('ADM',100.00),
('HR',15.00),
('L1',10.05),
('L2',14.00),
('L3',16.00),
('M1',24.00),
('M2',30.00),
('M3',28.00),
('SDE-1',14.00),
('SDE-2',18.00),
('SDE-3',22.00);
