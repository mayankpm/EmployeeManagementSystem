<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit My Profile</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            display: flex;
            background-color: #f8f9fa;
            color: #333;
            min-height: 100vh;
        }
        
        /* Sidebar Navigation */
        .sidebar {
            width: 250px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            padding: 25px 0;
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
        }
        
        .logo {
            padding: 0 25px 25px;
            border-bottom: 1px solid #eee;
            margin-bottom: 25px;
        }
        
        .logo h1 {
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .nav-links {
            flex: 1;
        }
        
        .nav-links a {
            display: flex;
            align-items: center;
            padding: 12px 25px;
            text-decoration: none;
            color: #555;
            transition: all 0.2s;
        }
        
        .nav-links a i {
            margin-right: 12px;
            width: 20px;
            text-align: center;
        }
        
        .nav-links a:hover, .nav-links a.active {
            background-color: #f0f2f5;
            color: #000;
            border-left: 3px solid #333;
        }
        
        .logout-sidebar-btn {
            margin: 20px;
            padding: 12px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
            text-align: center;
            text-decoration: none;
            display: block;
        }
        
        .logout-sidebar-btn:hover {
            background-color: #555;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 30px;
            margin-left: 250px;
            overflow-y: auto;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .page-title h1 {
            font-size: 1.8rem;
            font-weight: 600;
        }
        
        .page-title p {
            color: #666;
            margin-top: 5px;
        }
        
        .back-btn {
            padding: 8px 16px;
            background-color: #333;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        .form-container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 1rem;
        }
        
        input, textarea {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: #333;
        }
        
        textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 40px;
            padding-top: 25px;
            border-top: 2px solid #f0f2f5;
        }
        
        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
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
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
            border-left: 4px solid #333;
        }
        
        .employee-info h3 {
            margin-bottom: 10px;
            color: #333;
            font-size: 1.3rem;
        }
        
        .required {
            color: #e74c3c;
        }
        
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 12px 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        
        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 12px 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        }
        
        .password-note {
            font-size: 0.85rem;
            color: #666;
            margin-top: 5px;
            font-style: italic;
        }
        
        .non-editable {
            background-color: #f8f9fa;
            color: #666;
            cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
                gap: 0;
            }
            
            .main-content {
                padding: 20px;
                margin-left: 0;
            }
            
            .sidebar {
                transform: translateX(-100%);
            }
        }
    </style>
</head>
<body>
	<!-- Sidebar Navigation -->
	    <div class="sidebar">
	        <div class="logo">
	            <h1>Employee Portal</h1>
	        </div>
	        
	        <div class="nav-links">
				<a href="/employee/dashboard?empId=${employee.empId}"
				   class="${fn:contains(pageContext.request.requestURI, '/employee/dashboard') ? 'active' : ''}">
				   Dashboard
				</a>

				<a href="/employee/edit-profile?empId=${employee.empId}"
				   class="${fn:contains(pageContext.request.requestURI, '/employee/edit-profile') ? 'active' : ''}">
				   Edit Profile
				</a>
				<a href="/employee/view-payroll?empId=${employee.empId}"
				   class="${fn:contains(pageContext.request.requestURI, '/employee/view-payroll') ? 'active' : ''}">
				   View Payroll
				</a>
	        </div>
	        
	        <a href="/logout" class="logout-sidebar-btn">Logout</a>
	    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <div class="page-title">
                <h1>Edit My Profile</h1>
                <p>Update your personal contact information</p>
            </div>
            <a href="/employee/dashboard?empId=${employee.empId}" class="back-btn">← Back to Dashboard</a>
        </div>
 
        <c:if test="${not empty error}">
            <div class="error-message">
                ${error}
            </div>
        </c:if>
 
        <div class="form-container">
            <div class="employee-info">
                <h3>Employee ID: ${employee.empId}</h3>
                <p><strong>Name:</strong> ${employee.firstName} ${employee.lastName}</p>
                <p><strong>Role:</strong> ${employee.roleCode} | <strong>Department:</strong> ${employee.deptCode}</p>
              
            </div>
 
            <form action="/employee/update-profile" method="post" id="editProfileForm">
                <input type="hidden" name="empId" value="${employee.empId}">
 
                <div class="form-row">
                    <div class="form-group">
                        <label for="personalEmail">Personal Email <span class="required">*</span></label>
                        <input type="email" id="personalEmail" name="personalEmail" value="${employee.personalEmail}" required>
                    </div>
 
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="text" id="phone" name="phone" value="${employee.phone}">
                    </div>
                </div>
 
                <div class="form-group">
                    <label for="address">Address</label>
                    <textarea id="address" name="address">${employee.address}</textarea>
                </div>
 
                <div class="form-group">
                    <label for="password">New Password</label>
                    <input type="password" id="password" name="password" placeholder="Leave blank to keep current password">
                    <div class="password-note">Only enter if you want to change your password</div>
                </div>
 
                <!-- Non-editable fields for reference -->
                <div class="form-row">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" value="${employee.firstName}" class="non-editable" disabled>
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" value="${employee.lastName}" class="non-editable" disabled>
                    </div>
                </div>
 
                <div class="form-row">
                    <div class="form-group">
                        <label>Role</label>
                        <input type="text" value="${employee.roleCode}" class="non-editable" disabled>
                    </div>
                    <div class="form-group">
                        <label>Department</label>
                        <input type="text" value="${employee.deptCode}" class="non-editable" disabled>
                    </div>
                </div>
 
                <div class="form-actions">
                    <a href="/employee/dashboard?empId=${employee.empId}" class="btn btn-secondary">Cancel</a>
                    <button type="submit" class="btn btn-primary">Update Profile</button>
                </div>
            </form>
        </div>
    </div>
 
    <script>
        document.getElementById('editProfileForm').addEventListener('submit', function(e) {
            const email = document.getElementById('personalEmail').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address');
                return false;
            }
            
            return true;
        });
    </script>
</body>
</html>
 