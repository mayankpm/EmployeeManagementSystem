<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
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
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .add-employee-btn:hover {
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
        
        .logout-btn {
            padding: 8px 16px;
            background-color: #333;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        /* Stats Section */
        .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        /* Search and Filter */
        .search-container {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
        }
        
        .search-box {
            display: flex;
            width: 100%;
            max-width: 600px;
        }
        
        .search-input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-right: none;
            border-radius: 4px 0 0 4px;
            font-size: 1rem;
        }
        
        /* Employee Cards */
        .employees-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .employee-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            padding: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .employee-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        
        .employee-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .employee-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: 600;
            color: #555;
        }
        
        .employee-info h3 {
            font-size: 1.1rem;
            margin-bottom: 5px;
        }
        
        .employee-info p {
            color: #666;
            font-size: 0.9rem;
        }
        
        .employee-details {
            margin-bottom: 15px;
        }
        
        .detail-item {
            display: flex;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        
        .detail-label {
            color: #777;
            width: 80px;
        }
        
        .role-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .role-admin {
            background-color: #ffe6e6;
            color: #d63031;
        }
        
        .role-hr {
            background-color: #e6f3ff;
            color: #0984e3;
        }
        
        .role-employee {
            background-color: #e6ffe6;
            color: #00b894;
        }
        
        .employee-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .action-btn {
            padding: 6px 12px;
            border: 1px solid #ddd;
            background-color: #fff;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
            text-decoration: none;
            color: #333;
            display: inline-block;
        }
        
        .edit-btn:hover {
            background-color: #f8f9fa;
        }
        
        .delete-btn {
            color: #e74c3c;
            border-color: #e74c3c;
        }
        
        .delete-btn:hover {
            background-color: #e74c3c;
            color: white;
        }
        
        /* Pagination */
        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }
        
        .pagination button {
            padding: 8px 14px;
            margin: 0 5px;
            border: 1px solid #ddd;
            background-color: #fff;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
        }
 
        .pagination button:hover {
            background-color: #f0f2f5;
        }
 
        .pagination button.active {
            background-color: #333;
            color: #fff;
            border-color: #333;
        }
 
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            grid-column: 1 / -1;
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="logo">
            <h1>Admin Panel</h1>
        </div>
        
        <div class="nav-links">
            <a href="#" class="active">Employees</a>
            <a href="${pageContext.request.contextPath}/roles">Edit Role</a>
            <a href="${pageContext.request.contextPath}/departments">Edit Department</a>
        </div>
        
        <button class="add-employee-btn" onclick="location.href='${pageContext.request.contextPath}/register'">+ Add New Employee</button>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <div class="page-title">
                <h1>Employee Management</h1>
                <p>Manage all employees in the system</p>
            </div>
            <a href="${pageContext.request.contextPath}/login" class="logout-btn">Logout</a>
        </div>
        
        <!-- Search -->
        <div class="search-container">
            <div class="search-box">
                <input type="text" class="search-input" id="searchInput" placeholder="Search employees by name, email, or role...">
            </div>
        </div>
        
        <!-- Employee Cards -->
        <div class="employees-grid" id="employeesGrid">
            <c:choose>
                <c:when test="${not empty employees}">
                    <c:forEach var="emp" items="${employees}">
                        <div class="employee-card">
                            <div class="employee-header">
                                <div class="employee-avatar">
                                    ${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}
                                </div>
                                <div class="employee-info">
                                    <h3>${emp.firstName} ${emp.lastName}</h3>
                                    <p>${emp.personalEmail}</p>
                                </div>
                            </div>
                            
                            <div class="employee-details">
                                <div class="detail-item">
                                    <span class="detail-label">ID:</span>
                                    <span>${emp.empId}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Phone:</span>
                                    <span>${emp.phone}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Age:</span>
                                    <span>${emp.age}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Role:</span>
                                    <span class="role-badge
                                        <c:choose>
                                            <c:when test="${emp.roleCode == 'ADMIN'}">role-admin</c:when>
                                            <c:when test="${emp.roleCode == 'HR'}">role-hr</c:when>
                                            <c:otherwise>role-employee</c:otherwise>
                                        </c:choose>">
                                        ${emp.roleCode}
                                    </span>
                                </div>
                                <c:if test="${not empty emp.deptCode}">
                                    <div class="detail-item">
                                        <span class="detail-label">Department:</span>
                                        <span>${emp.deptCode}</span>
                                    </div>
                                </c:if>
                                <c:if test="${not empty emp.address}">
                                    <div class="detail-item">
                                        <span class="detail-label">Address:</span>
                                        <span>${emp.address}</span>
                                    </div>
                                </c:if>
                                <c:if test="${not empty emp.workMail}">
                                    <div class="detail-item">
                                        <span class="detail-label">Work Email:</span>
                                        <span>${emp.workMail}</span>
                                    </div>
                                </c:if>
                            </div>
                            
                            <div class="employee-actions">
                                <a href="${pageContext.request.contextPath}/admin/edit/${emp.empId}" class="action-btn edit-btn">Edit</a>
                                <a href="${pageContext.request.contextPath}/admin/delete/${emp.empId}" class="action-btn delete-btn"
                                   onclick="return confirm('Are you sure you want to delete ${emp.firstName} ${emp.lastName}?')">
                                    Delete
                                </a>
                            </div>
                        </div>
                    </c:forEach>
                </c:when>
                <c:otherwise>
                    <div class="no-data">
                        <h3>No employees found</h3>
                        <p>Add new employees using the "Add New Employee" button</p>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
 
        <!-- Pagination -->
        <div class="pagination" id="pagination"></div>
    </div>
 
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            const employeesGrid = document.getElementById('employeesGrid');
            const employeeCards = Array.from(document.querySelectorAll('.employee-card'));
            const paginationContainer = document.getElementById('pagination');
 
            const cardsPerPage = 6;
            let currentPage = 1;
            let filteredCards = [...employeeCards];
 
            function showPage(page, cards) {
                const start = (page - 1) * cardsPerPage;
                const end = start + cardsPerPage;
 
                cards.forEach((card, index) => {
                    card.style.display = (index >= start && index < end) ? 'block' : 'none';
                });
            }
 
            function renderPagination(cards) {
                paginationContainer.innerHTML = '';
                const totalPages = Math.ceil(cards.length / cardsPerPage);
 
                if (totalPages <= 1) {
                    paginationContainer.style.display = 'none';
                    return;
                } else {
                    paginationContainer.style.display = 'flex';
                }
 
                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i;
                    if (i === currentPage) button.classList.add('active');
                    
                    button.addEventListener('click', () => {
                        currentPage = i;
                        showPage(currentPage, filteredCards);
                        renderPagination(filteredCards);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
 
                    paginationContainer.appendChild(button);
                }
            }
 
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                filteredCards = employeeCards.filter(card =>
                    card.textContent.toLowerCase().includes(searchTerm)
                );
                currentPage = 1;
                showPage(currentPage, filteredCards);
                renderPagination(filteredCards);
            });
 
            showPage(currentPage, filteredCards);
            renderPagination(filteredCards);
        });
    </script>
</body>
</html>
 
 