<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Role Management</title>
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
        background-color: #f9fafb;
        color: #333;
        display: flex;
        min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
        width: 250px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
        padding: 24px 0;
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100vh;
        justify-content: space-between;
    }
    .logo {
        padding: 0 24px 18px;
        border-bottom: 1px solid #eee;
        margin-bottom: 18px;
    }
    .logo h1 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #111827;
    }
    .nav-links {
        display: flex;
        flex-direction: column;
    }
    .nav-links a {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        text-decoration: none;
        color: #555;
        transition: all 0.18s;
        font-weight: 500;
    }
    .nav-links a:hover, .nav-links a.active {
        background-color: #f3f4f6;
        color: #111827;
        border-left: 3px solid #333;
    }
    .add-employee-btn {
        margin: 18px 24px;
        padding: 10px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.18s;
    }
    .add-employee-btn:hover {
        background-color: #555;
    }

    /* Main */
    .main {
        flex: 1;
        padding: 2rem;
        background: #fff;
        border-radius: 12px;
        margin: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        margin-left: 290px;
    }
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    .page-header h2 {
        margin-bottom: 0;
        color: #111827;
        font-weight: 600;
    }
    .logout-btn {
        padding: 8px 12px;
        background-color: transparent;
        border: 1px solid #e5e7eb;
        color: #111827;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
    }

    /* Table */
    table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 0 rgba(0,0,0,0.02);
    }
    thead {
        background-color: #f8fafc;
    }
    th, td {
        text-align: left;
        padding: 0.9rem 1.2rem;
        font-size: 15px;
        vertical-align: middle;
    }
    th {
        color: #374151;
        font-weight: 600;
        border-bottom: 1px solid #e5e7eb;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: .04em;
    }
    td {
        border-bottom: 1px solid #f0f0f0;
        color: #4b5563;
    }
    tr:hover td {
        background-color: #fbfdfe;
    }

    /* Buttons */
    .btn {
        padding: 0.45rem 1rem;
        font-size: 14px;
        border-radius: 8px;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-block;
    }
    .edit {
        background-color: #fff;
        border: 1px solid #e6e6e6;
        color: #111827;
    }
    .edit:hover {
        background-color: #f3f4f6;
    }
    .delete {
        background-color: #fff;
        border: 1px solid #f49a98;
        color: #dc2626;
        margin-left: 0.5rem;
    }
    .delete:hover {
        background-color: #fff5f5;
    }

    input[type="number"], input[type="text"] {
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 6px;
        width: 120px;
        font-size: 14px;
    }

    /* Add Form */
    .add-form {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
    }
    .add-form input {
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
    }
    .btn-add {
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 0.6rem 1.1rem;
        border-radius: 8px;
        font-weight: 600;
    }
    .btn-add:hover {
        background-color: #1d4ed8;
    }
</style>
</head>

<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div>
            <div class="logo"><h1>Admin Panel</h1></div>
            <div class="nav-links">
                <a href="${pageContext.request.contextPath}/admin/dashboard">Employees</a>
                <a href="${pageContext.request.contextPath}/roles" class="active">Edit Role</a>
                <a href="${pageContext.request.contextPath}/departments">Edit Department</a>
            </div>
        </div>
        <button class="add-employee-btn" onclick="location.href='${pageContext.request.contextPath}/register'">
            + Add New Employee
        </button>
    </div>

    <!-- Main Content -->
    <div class="main">
        <div class="page-header">
            <div>
                <h2>Role Management</h2>
                <div class="muted">Manage base salaries for each role</div>
            </div>
            <a href="${pageContext.request.contextPath}/login" class="logout-btn">Logout</a>
        </div>

        <!-- Table -->
        <table>
            <thead>
                <tr>
                    <th>Role Code</th>
                    <th>Base Salary (in Lakhs)</th>
                    <th style="text-align:center;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="role" items="${roles}">
                    <tr>
                        <td>${role.roleCode}</td>
                        <td>
                            <form action="${pageContext.request.contextPath}/roles/update" method="post" style="display:inline;">
                                <input type="hidden" name="roleCode" value="${role.roleCode}">
                                <input type="number" name="baseSalary" value="${role.baseSalary}" step="0.01" required>
                                <button type="submit" class="btn edit">Update</button>
                            </form>
                        </td>
                        <td style="text-align:center;">
                            <a href="${pageContext.request.contextPath}/roles/delete/${role.roleCode}"
                               class="btn delete"
                               onclick="return confirm('Delete this role?')">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <!-- Add Role -->
        <form class="add-form" action="${pageContext.request.contextPath}/roles/add" method="post">
            <input type="text" name="roleCode" placeholder="Role Code" required>
            <input type="number" name="baseSalary" step="0.01" placeholder="Base Salary" required>
            <button type="submit" class="btn-add">Add Role</button>
        </form>
    </div>
</body>
</html>