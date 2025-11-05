<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Employee Details</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f8f9fa;
            color: #333;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .header h1 {
            font-size: 1.8rem;
            font-weight: 600;
        }
        
        .back-btn {
            padding: 8px 16px;
            background-color: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9rem;
            transition: background-color 0.2s;
        }
        
        .back-btn:hover {
            background-color: #5a6268;
        }

        .info-container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .employee-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 25px;
            border-left: 4px solid #333;
        }

        .employee-info h3 {
            margin-bottom: 8px;
            color: #333;
        }

        .info-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }

        .info-group label {
            font-weight: 500;
            color: #555;
        }

        .info-value {
            margin-top: 5px;
            font-size: 1rem;
            color: #222;
            background-color: #f1f3f5;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }

        @media (max-width: 768px) {
            .info-row {
                grid-template-columns: 1fr;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Employee Details</h1>
            <a href="/hr/dashboard" class="back-btn">← Back to Dashboard</a>
        </div>

        <div class="info-container">
            <div class="employee-info">
                <h3>Employee ID: ${employee.empId}</h3>
                <p>Here are the full details of the employee.</p>
            </div>

            <div class="info-row">
                <div class="info-group">
                    <label>First Name</label>
                    <div class="info-value">${employee.firstName}</div>
                </div>
                <div class="info-group">
                    <label>Last Name</label>
                    <div class="info-value">${employee.lastName}</div>
                </div>
            </div>

            <div class="info-row">
                <div class="info-group">
                    <label>Age</label>
                    <div class="info-value">${employee.age}</div>
                </div>
                <div class="info-group">
                    <label>Personal Email</label>
                    <div class="info-value">${employee.personalEmail}</div>
                </div>
            </div>

            <div class="info-row">
                <div class="info-group">
                    <label>Phone</label>
                    <div class="info-value">${employee.phone}</div>
                </div>
                <div class="info-group">
                    <label>Role</label>
                    <div class="info-value">${employee.roleCode}</div>
                </div>
            </div>

            <div class="info-row">
                <div class="info-group">
                    <label>Department</label>
                    <div class="info-value">${employee.deptCode}</div>
                </div>
                <div class="info-group">
                    <label>Address</label>
                    <div class="info-value">${employee.address}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
