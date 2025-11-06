<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Edit Department</title>
<style>
    /* ---------- GLOBAL ---------- */
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

    /* ---------- SIDEBAR ---------- */
    .sidebar {
        width: 250px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
        padding: 25px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
    .nav-links {
        flex-grow: 1;
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
    .add-employee-btn {
        margin: 20px;
        padding: 12px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: 0.2s;
    }
    .add-employee-btn:hover {
        background-color: #555;
    }

    /* ---------- MAIN CONTENT ---------- */
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
    .page-title p {
        color: #666;
        margin-top: 5px;
    }
    .logout-btn {
        padding: 8px 16px;
        background-color: #333;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    /* ---------- TABLE SECTION ---------- */
    .department-table-container {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.05);
        padding: 25px;
        overflow-x: auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: 14px 12px;
        text-align: center;
        border-bottom: 1px solid #eee;
    }
    th {
        background-color: #f7f7f7;
        font-weight: 600;
        color: #333;
    }
    tr:hover {
        background-color: #fafafa;
    }
    input[type="text"] {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: #fff;
        transition: border 0.2s;
    }
    input[type="text"]:focus {
        border-color: #333;
        outline: none;
    }

    /* ---------- BUTTONS ---------- */
    .btn {
        padding: 8px 18px;
        border-radius: 6px;
        border: 1px solid transparent;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.25s ease;
    }
    .edit {
        background-color: white;
        border: 1px solid #ccc;
        color: #333;
    }
    .edit:hover {
        background-color: #f0f0f0;
        border-color: #999;
    }
    .delete {
        background-color: white;
        border: 1px solid #ff4d4f;
        color: #ff4d4f;
        margin-left: 8px;
    }
    .delete:hover {
        background-color: #ff4d4f;
        color: white;
    }

    /* ---------- ADD FORM ---------- */
    .add-department-form {
        margin-top: 35px;
        background: #fff;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    }
    .add-department-form h2 {
        font-size: 1.4rem;
        margin-bottom: 15px;
        color: #333;
    }
    .form-group {
        margin-bottom: 15px;
    }
    label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #555;
    }
    button {
        background: #333;
        color: white;
        padding: 10px 16px;
        border: none;
        border-radius: 6px;
        font-size: 15px;
        cursor: pointer;
        transition: 0.3s;
    }
    button:hover {
        background: #555;
    }
</style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div>
            <div class="logo">
                <h1>Admin Panel</h1>
            </div>
            <div class="nav-links">
                <a href="${pageContext.request.contextPath}/admin/dashboard">Employees</a>
                <a href="${pageContext.request.contextPath}/roles">Edit Role</a>
                <a href="${pageContext.request.contextPath}/departments" class="active">Edit Department</a>
            </div>
        </div>
        <button class="add-employee-btn" onclick="location.href='${pageContext.request.contextPath}/register'">
            + Add New Employee
        </button>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <div class="page-title">
                <h1>Department Management</h1>
                <p>Manage department names and assigned HR personnel</p>
            </div>
            <a href="${pageContext.request.contextPath}/login" class="logout-btn">Logout</a>
        </div>

        <div class="department-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Department Code</th>
                        <th>Department Name</th>
                        <th>Assigned HR</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="dept" items="${departments}">
                        <tr>
                            <form action="${pageContext.request.contextPath}/departments/update" method="post" style="display:inline;">
                                <td><input type="text" name="deptCode" value="${dept.deptCode}" readonly></td>
                                <td><input type="text" name="deptName" value="${dept.deptName}" required></td>
                                <td><input type="text" name="assignedHR" value="${dept.assignedHR}"></td>
                                <td>
                                    <button type="submit" class="btn edit">Edit</button>
                                    <a href="${pageContext.request.contextPath}/departments/delete/${dept.deptCode}"
                                       class="btn delete"
                                       onclick="return confirm('Delete this department?')">Delete</a>
                                </td>
                            </form>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>

            <div class="add-department-form">
                <h2>Add New Department</h2>
                <form action="${pageContext.request.contextPath}/departments/add" method="post">
                    <div class="form-group">
                        <label>Department Code:</label>
                        <input type="text" name="deptCode" required>
                    </div>
                    <div class="form-group">
                        <label>Department Name:</label>
                        <input type="text" name="deptName" required>
                    </div>
                    <div class="form-group">
                        <label>Assigned HR:</label>
                        <input type="text" name="assignedHR">
                    </div>
                    <button type="submit">Add Department</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>