<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Employee</title>
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

        .form-container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #555;
        }

        input, select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #333;
        }

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .btn {
            padding: 10px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
            text-align: center;
            transition: all 0.2s;
        }

        .btn-primary {
            background-color: #333;
            color: white;
        }

        .btn-primary:hover {
            background-color: #555;
        }

        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #5a6268;
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

        .required {
            color: #e74c3c;
        }

        .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
            display: none;
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
                gap: 0;
            }

            .container {
                padding: 10px;
            }

            .form-container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">

        <%-- Detect role of logged-in user --%>
        <c:set var="roleCode" value="${sessionScope.loggedInUser.roleCode}" />

        <div class="header">
            <h1>Edit Employee</h1>
            <a href="/hr/dashboard" class="back-btn">← Back to Dashboard</a>
        </div>

        <div class="form-container">
            <div class="employee-info">
                <h3>Employee ID: ${employee.empId}</h3>
                <p>Edit the details below and click "Update Employee" to save changes.</p>
            </div>

            <form action="/hr/update" method="post" id="editEmployeeForm">
                <input type="hidden" name="empId" value="${employee.empId}">

                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name <span class="required">*</span></label>
                        <input type="text" id="firstName" name="firstName" value="${employee.firstName}" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name <span class="required">*</span></label>
                        <input type="text" id="lastName" name="lastName" value="${employee.lastName}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="age">Age <span class="required">*</span></label>
                        <input type="number" id="age" name="age" value="${employee.age}" min="18" max="65" required>
                    </div>
                    <div class="form-group">
                        <label for="personalEmail">Personal Email <span class="required">*</span></label>
                        <input type="email" id="personalEmail" name="personalEmail" value="${employee.personalEmail}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="text" id="phone" name="phone" value="${employee.phone}">
                    </div>
                    <div class="form-group">
                        <label for="roleCode">Role <span class="required">*</span></label>
						<select id="roleCode" name="roleCode" required>
						    <option value="">Select Role</option>
						    <option value="L1" ${employee.roleCode == 'L1' ? 'selected' : ''}>Level 1</option>
						    <option value="L2" ${employee.roleCode == 'L2' ? 'selected' : ''}>Level 2</option>
						    <option value="L3" ${employee.roleCode == 'L3' ? 'selected' : ''}>Level 3</option>
						    <option value="M1" ${employee.roleCode == 'M1' ? 'selected' : ''}>Manager Level 1</option>
						    <option value="M2" ${employee.roleCode == 'M2' ? 'selected' : ''}>Manager Level 2</option>
						    <option value="M3" ${employee.roleCode == 'M3' ? 'selected' : ''}>Manager Level 3</option>
						    <option value="SDE-1" ${employee.roleCode == 'SDE-1' ? 'selected' : ''}>Software Dev Engineer 1</option>
						    <option value="SDE-2" ${employee.roleCode == 'SDE-2' ? 'selected' : ''}>Software Dev Engineer 2</option>
						    <option value="SDE-3" ${employee.roleCode == 'SDE-3' ? 'selected' : ''}>Software Dev Engineer 3</option>
						    <option value="HR" ${employee.roleCode == 'HR' ? 'selected' : ''}>HR</option>
						    <option value="MGR" ${employee.roleCode == 'MGR' ? 'selected' : ''}>Manager</option>
						</select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="deptCode">Department <span class="required">*</span></label>
                        <select id="deptCode" name="deptCode" required>
                            <option value="">Select Department</option>
                            <option value="R&D" ${employee.deptCode == 'R&D' ? 'selected' : ''}>R&D</option>
                            <option value="PSO" ${employee.deptCode == 'PSO' ? 'selected' : ''}>PSO</option>
                            <option value="CSO" ${employee.deptCode == 'CSO' ? 'selected' : ''}>CSO</option>
                            <option value="HR" ${employee.deptCode == 'HR' ? 'selected' : ''}>HR</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" id="address" name="address" value="${employee.address}">
                    </div>
                </div>

                <div class="form-actions">
                    <a href="/hr/dashboard" class="btn btn-secondary">Cancel</a>
                    <button type="submit" class="btn btn-primary">Update Employee</button>
                </div>
            </form>
        </div>
    </div>

	<script>
	    document.getElementById('editEmployeeForm').addEventListener('submit', function(e) {
	        const firstName = document.getElementById('firstName').value.trim();
	        const lastName = document.getElementById('lastName').value.trim();
	        const age = document.getElementById('age').value;
	        const email = document.getElementById('personalEmail').value.trim();
	        const role = document.getElementById('roleCode').value;
	        const dept = document.getElementById('deptCode').value;

	        if (!firstName || !lastName || !age || !email || !role || !dept) {
	            e.preventDefault();
	            alert('Please fill in all required fields');
	            return false;
	        }

	        // ✅ relaxed and correct email validation
	        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	        if (!emailRegex.test(email)) {
	            e.preventDefault();
	            alert('Please enter a valid email address (e.g. user@example.com)');
	            return false;
	        }

	        return true;
	    });
	</script>
</body>
</html>
