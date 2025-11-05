<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Dashboard - EMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
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
        
        .logout-btn {
            padding: 8px 16px;
            background-color: #333;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        /* Success Message */
        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 12px 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        }
        
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 12px 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        
        /* Employee Profile Card */
        .profile-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            padding: 30px;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-bottom: 30px;
        }
        
        .profile-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
        }
        
        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            font-weight: 600;
            color: #555;
            font-size: 2rem;
        }
        
        .profile-info h2 {
            font-size: 1.8rem;
            margin-bottom: 8px;
            color: #333;
        }
        
        .profile-info p {
            color: #666;
            margin-bottom: 5px;
            font-size: 1rem;
        }
        
        .role-badge {
            display: inline-block;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 8px;
        }
        
        .role-employee {
            background-color: #e6ffe6;
            color: #00b894;
        }
        
        .profile-details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 25px;
        }
        
        .detail-group h3 {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #f0f2f5;
            padding-bottom: 8px;
        }
        
        .detail-item {
            display: flex;
            margin-bottom: 12px;
            font-size: 0.9rem;
        }
        
        .detail-label {
            color: #777;
            width: 100px;
            font-weight: 500;
        }
        
        .detail-value {
            font-weight: 600;
            color: #333;
            flex: 1;
        }
        
        /* Search Section */
        .search-section {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            padding: 25px;
            margin-bottom: 25px;
        }
        
        .search-section h3 {
            margin-bottom: 15px;
            color: #333;
            font-size: 1.2rem;
        }
        
        .search-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
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
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .search-btn {
            padding: 12px 20px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-left: 10px;
            transition: background-color 0.2s;
        }
        
        .search-btn:hover {
            background-color: #555;
        }
        
        /* Search Results */
        .search-results {
            background-color: #fff;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            margin-top: 20px;
        }
        
        .search-results h4 {
            margin-bottom: 20px;
            color: #333;
            font-size: 1.1rem;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f2f5;
        }
        
        .employee-contact-card {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 15px;
            border-left: 4px solid #333;
        }
        
        .contact-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .contact-name {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .contact-role {
            font-size: 0.8rem;
            padding: 4px 10px;
            border-radius: 15px;
            background: #e9ecef;
        }
        
        .contact-details {
            color: #666;
            font-size: 0.9rem;
        }
        
        .contact-details p {
            margin-bottom: 5px;
        }
        
        .no-results {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        /* Role-specific colors */
        .role-L1 { background-color: #e6f3ff; color: #0984e3; }
        .role-L2 { background-color: #e6ffe6; color: #00b894; }
        .role-HR { background-color: #fff0e6; color: #e17055; }
        .role-MGR { background-color: #f0e6ff; color: #6c5ce7; }
        
        @media (max-width: 1024px) {
            .profile-details {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            
            .sidebar.active {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
                padding: 20px;
            }
            
            .profile-details {
                grid-template-columns: 1fr;
            }
            
            .profile-header {
                flex-direction: column;
                text-align: center;
            }
            
            .profile-avatar {
                margin-right: 0;
                margin-bottom: 15px;
            }
            
            .menu-toggle {
                display: block;
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 3000;
                background: #333;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
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
            <a href="#" class="active">Dashboard</a>
            <a href="/employee/edit-profile?empId=${employee.empId}">Edit Profile</a>
            <a href="${pageContext.request.contextPath}/employee/payroll?empId=${employee.empId}" id="viewPayrollBtn">View Payroll</a>
        </div>
        
        <a href="/logout" class="logout-sidebar-btn">Logout</a>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <!-- Success and Error Messages -->
        <c:if test="${not empty success}">
            <div class="success-message">
                ${success}
            </div>
        </c:if>
        
        <c:if test="${not empty error}">
            <div class="error-message">
                ${error}
            </div>
        </c:if>
        
        <div class="header">
            <div class="page-title">
                <h1>Employee Dashboard</h1>
                <p>Welcome, ${employee.firstName}! Here's your dashboard overview</p>
            </div>
            <a href="/logout" class="logout-btn">Logout</a>
        </div>
        
        <!-- Employee Profile Card -->
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-avatar">
                    ${fn:substring(employee.firstName,0,1)}${fn:substring(employee.lastName,0,1)}
                </div>
                <div class="profile-info">
                    <h2>${employee.firstName} ${employee.lastName}</h2>
                    <p>${employee.personalEmail}</p>
                    <p>${employee.phone}</p>
                    <span class="role-badge role-employee">${employee.roleCode}</span>
                </div>
            </div>
            
            <div class="profile-details">
                <div class="detail-group">
                    <h3>Personal Information</h3>
                    <div class="detail-item">
                        <span class="detail-label">Employee ID:</span>
                        <span class="detail-value">EMP${employee.empId}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Age:</span>
                        <span class="detail-value">${employee.age}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${employee.phone}</span>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h3>Contact Details</h3>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${employee.personalEmail}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address:</span>
                        <span class="detail-value">${employee.address}</span>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h3>Employment Details</h3>
                    <div class="detail-item">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${employee.deptCode}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Work Mail:</span>
                        <span class="detail-value">${employee.workMail}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Role:</span>
                        <span class="detail-value">${employee.roleCode}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Search Section -->
        <div class="search-section">
            <h3>Employee Directory</h3>
            <div class="search-container">
                <form method="get" action="/employee/search" class="search-box">
                    <input type="hidden" name="empId" value="${employee.empId}">
                    <input type="text" name="query" class="search-input" id="employeeSearch" 
                           placeholder="Search by name, email, or department..." 
                           value="${searchQuery}">
                    <button type="submit" class="search-btn">Search</button>
                </form>
            </div>

            <c:if test="${not empty results}">
                <div class="search-results" id="searchResults">
                    <h4>Search Results <c:if test="${not empty searchQuery}">for "${searchQuery}"</c:if></h4>
                    <c:forEach var="emp" items="${results}">
                        <div class="employee-contact-card">
                            <div class="contact-header">
                                <span class="contact-name">${emp.firstName} ${emp.lastName}</span>
                                <span class="contact-role role-${emp.roleCode}">${emp.roleCode}</span>
                            </div>
                            <div class="contact-details">
                                <p>Email: ${emp.personalEmail}</p>
                                <p>Phone: ${emp.phone}</p>
                                <p>Department: ${emp.deptCode}</p>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </c:if>

            <c:if test="${empty results && not empty searchQuery}">
                <div class="search-results">
                    <div class="no-results">
                        <p>No employees found matching "${searchQuery}"</p>
                        <p style="font-size: 0.9rem; margin-top: 5px;">Try searching with different keywords</p>
                    </div>
                </div>
            </c:if>
        </div>
    </div>

    <script>
        // Search functionality
        const searchEmployeesBtn = document.getElementById('searchEmployeesBtn');
        const employeeSearch = document.getElementById('employeeSearch');

        // Scroll to search section when search link is clicked
        searchEmployeesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.search-section').scrollIntoView({
                behavior: 'smooth'
            });
            // Focus on search input after scrolling
            setTimeout(() => {
                employeeSearch.focus();
            }, 500);
        });

        // Auto-focus on search input when search section is clicked
        employeeSearch.addEventListener('click', function() {
            this.focus();
        });

        // Mobile menu toggle (for responsive design)
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.className = 'menu-toggle';
        menuToggle.style.display = 'none';
        document.body.appendChild(menuToggle);

        const sidebar = document.querySelector('.sidebar');

        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });

        // Check screen size and show/hide menu toggle
        function checkScreenSize() {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
            } else {
                menuToggle.style.display = 'none';
                sidebar.classList.remove('active');
            }
        }

        // Initial check
        checkScreenSize();

        // Check on resize
        window.addEventListener('resize', checkScreenSize);

        // Close sidebar when clicking on a link (mobile)
        sidebar.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    </script>
</body>
</html>