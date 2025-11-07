<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<jsp:useBean id="now" class="java.util.Date" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><c:out value="${pageTitle != null ? pageTitle : 'Payroll Management'}"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            text-align: center;
            text-decoration: none;
            display: block;
            transition: background-color 0.2s;
        }

        .logout-sidebar-btn:hover {
            background-color: #555;
        }

        /* ---------- MAIN CONTENT ---------- */
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

        /* ---------- TABLE ---------- */
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        thead {
            background-color: #f8fafc;
        }

        th, td {
            text-align: left;
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            font-size: 15px;
        }

        th {
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            font-size: 12px;
        }

        tr:hover td {
            background-color: #fbfdfe;
        }

        /* ---------- ALERTS ---------- */
        .alert {
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 16px;
        }

        .alert-info {
            background-color: #e0f2fe;
            color: #0369a1;
        }

        .alert-success {
            background-color: #dcfce7;
            color: #166534;
        }

        .alert-secondary {
            background-color: #f3f4f6;
            color: #374151;
        }

        /* ---------- BUTTONS ---------- */
        .btn {
            padding: 6px 14px;
            font-size: 14px;
            border-radius: 6px;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.15s ease;
            display: inline-block;
            line-height: 1;
        }

        .btn-primary {
            background-color: #2563eb;
            color: white;
            border: none;
        }

        .btn-primary:hover {
            background-color: #1e40af;
        }

        /* ---------- NO DATA ---------- */
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        @media (max-width: 900px) {
            .main-content {
                margin-left: 0;
                padding: 15px;
            }
            .sidebar {
                display: none;
            }
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
            <a href="${pageContext.request.contextPath}/hr/dashboard">Employees</a>
            <a href="${pageContext.request.contextPath}/hr/payroll" class="active">Payroll Management</a>
            <a href="${pageContext.request.contextPath}/hr/approvals">Approvals</a>
        </div>
        <a href="${pageContext.request.contextPath}/login" class="logout-sidebar-btn">Logout</a>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <div class="page-title">
                <h1>Payroll Management</h1>
                <p>Manage and view employee salary details</p>
            </div>
            <a href="${pageContext.request.contextPath}/login" class="logout-btn">Logout</a>
        </div>

        <c:if test="${employee != null}">
            <div class="alert alert-info">
                Showing payroll for <strong><c:out value="${employee.firstName}"/></strong>
            </div>
        </c:if>

        <c:if test="${param.generated != null}">
            <div class="alert alert-success">Payroll generated successfully.</div>
        </c:if>

        <c:if test="${param.updated != null}">
            <div class="alert alert-success">Payroll updated successfully.</div>
        </c:if>

        <table>
            <thead>
                <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Net Salary</th>
                    <th>Generated Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="payroll" items="${payrolls}">
                    <tr>
                        <td><c:out value="${payroll.empId}" /></td>
                        <td>
                            <c:out value="${payroll.employee.firstName}" />
                            <c:if test="${not empty payroll.employee.lastName}">
                                <c:out value=" ${payroll.employee.lastName}" />
                            </c:if>
                        </td>
                        <td><fmt:formatNumber value="${payroll.computedCtc}" type="number" minFractionDigits="2" /></td>
                        <td><fmt:formatDate value="${now}" pattern="yyyy-MM-dd" /></td>
                        <td>
                            <c:choose>
                                <c:when test="${fn:contains(pageContext.request.requestURI, '/hr/')}">
                                    <form action="<c:url value='/hr/payroll/pdf/${payroll.empId}' />" method="get" style="display:inline;">
                                        <button type="submit" class="btn btn-primary btn-sm">Generate PDF</button>
                                    </form>
                                </c:when>
                                <c:otherwise>
                                    <form action="<c:url value='/employee/payroll/pdf/${payroll.empId}' />" method="get" style="display:inline;">
                                        <button type="submit" class="btn btn-primary btn-sm">Download Slip</button>
                                    </form>
                                </c:otherwise>
                            </c:choose>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <c:if test="${empty payrolls}">
            <div class="no-data">
                No payroll records available yet.
            </div>
        </c:if>
    </div>
</body>
</html>
 