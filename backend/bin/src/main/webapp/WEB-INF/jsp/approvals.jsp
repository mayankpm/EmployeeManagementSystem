<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HR Approvals</title>
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

        /* Sidebar */
        .sidebar {
            width: 250px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            padding: 25px 0;
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
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

        .nav-links a {
            display: flex;
            align-items: center;
            padding: 12px 25px;
            text-decoration: none;
            color: #555;
            transition: all 0.2s;
        }

        .nav-links a:hover, .nav-links a.active {
            background-color: #f0f2f5;
            color: #000;
            border-left: 3px solid #333;
        }

        .logout-btn {
            margin: 20px;
            padding: 10px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            text-align: center;
            text-decoration: none;
        }

        .logout-btn:hover {
            background-color: #555;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            padding: 30px;
            margin-left: 250px;
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

        /* Table */
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
        }

        th, td {
            padding: 15px 20px;
            text-align: left;
        }

        th {
            background-color: #f4f4f4;
            font-weight: 600;
            color: #555;
        }

        tr:nth-child(even) {
            background-color: #fafafa;
        }

        tr:hover {
            background-color: #f1f3f5;
        }

        .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .btn-approve {
            background-color: #28a745;
            color: white;
        }

        .btn-approve:hover {
            background-color: #218838;
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #777;
            font-size: 1rem;
        }
		.btn-decline {
		    background-color: #dc3545;
		    color: white;
		}
		.btn-decline:hover {
		    background-color: #c82333;
		}

    </style>
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar">
        <div class="logo">
            <h1>HR Panel</h1>
        </div>

		<div class="nav-links">
		    <a href="${pageContext.request.contextPath}/hr/dashboard"
		       class="${fn:contains(pageContext.request.requestURI, '/hr/dashboard') ? 'active' : ''}">
		       Employees
		    </a>

		    <a href="${pageContext.request.contextPath}/hr/payroll"
		       class="${fn:contains(pageContext.request.requestURI, '/hr/payroll') ? 'active' : ''}">
		       Payroll Management
		    </a>

		    <a href="${pageContext.request.contextPath}/hr/approvals"
		       class="${fn:contains(pageContext.request.requestURI, '/hr/approvals') ? 'active' : ''}">
		       Approvals
		    </a>
		</div>



        <a href="${pageContext.request.contextPath}/login" class="logout-btn">Logout</a>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <div class="page-title">
                <h1>Pending Approvals</h1>
                <p>List of employees awaiting HR approval</p>
            </div>
        </div>

        <c:if test="${empty pendingEmployees}">
            <div class="no-data">
                ✅ All employees have been approved!
            </div>
        </c:if>

        <c:if test="${not empty pendingEmployees}">
            <table>
                <thead>
                    <tr>
                        <th>Emp ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="emp" items="${pendingEmployees}">
                        <tr>
                            <td>${emp.empId}</td>
                            <td>${emp.firstName} ${emp.lastName}</td>
                            <td>${emp.personalEmail}</td>
                            <td>${emp.deptCode}</td>
                            <td>${emp.roleCode}</td>
                            <td>
							    <form action="${pageContext.request.contextPath}/hr/sendCredentials/${emp.empId}" method="post" style="display:inline;">
							        <input type="hidden" name="empId" value="${emp.empId}">
							        <button type="submit" class="btn btn-approve">Approve</button>
							    </form>
							    <form action="${pageContext.request.contextPath}/declineEmployee" method="post" style="display:inline;">
							        <input type="hidden" name="empId" value="${emp.empId}">
							        <button type="submit" class="btn btn-decline">Decline</button>
							    </form>
							</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </c:if>
    </div>

</body>
</html>
