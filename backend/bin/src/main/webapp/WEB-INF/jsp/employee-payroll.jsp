<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<jsp:useBean id="now" class="java.util.Date" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Employee Payroll</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"/>
</head>
<body class="bg-light">

<div class="container mt-5 mb-5">

    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-semibold text-primary">Employee Payroll</h3>
        <a href="/employee/dashboard?empId=${employee.empId}" class="btn btn-outline-secondary btn-sm">&larr; Back to Dashboard</a>
    </div>

    <!-- Employee Info -->
    <c:if test="${employee != null}">
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <h5 class="mb-1 fw-bold"><c:out value="${employee.firstName}"/> <c:out value="${employee.lastName}"/></h5>
                <p class="text-muted mb-0">
                    Employee ID: <strong><c:out value="${employee.empId}"/></strong> &nbsp; | &nbsp;
                    Department: <strong><c:out value="${employee.deptCode}"/></strong> &nbsp; | &nbsp;
                </p>
            </div>
        </div>
    </c:if>

    <!-- Payroll Table -->
    <div class="card shadow-sm border-0">
        <div class="card-body">
            <h6 class="fw-semibold mb-3">Payroll History</h6>

            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Net Salary</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="payroll" items="${payrolls}">
                        <tr>
                            <td><fmt:formatNumber value="${payroll.ctc}" type="number" minFractionDigits="2" /></td>
                            <td>
                                <form action="<c:url value='/employee/payroll/pdf/${employee.empId}' />" method="get" style="margin:0;">
                                    <button type="submit" class="btn btn-primary btn-sm">Generate Slip</button>
                                </form>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>

            <c:if test="${empty payrolls}">
                <div class="alert alert-secondary text-center mt-3 mb-0">
                    No payroll records found.
                </div>
            </c:if>
        </div>
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
 