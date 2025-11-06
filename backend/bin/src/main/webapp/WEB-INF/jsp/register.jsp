<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Registration</title>

    <style>
        /* ---------- RESET ---------- */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* ---------- BODY ---------- */
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background: linear-gradient(135deg, #8EC5FC, #E0C3FC); /* Light Blue Gradient */
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
        }

        /* ---------- MAIN HEADING ---------- */
        .main-heading {
            color: #003366;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 30px;
            letter-spacing: 1px;
            text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.6);
        }

        /* ---------- CONTAINER ---------- */
        .register-container {
            background-color: #ffffff;
            width: 100%;
            max-width: 500px;
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.8s ease;
            text-align: left;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ---------- HEADING ---------- */
        h2 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }

        /* ---------- FORM ELEMENTS ---------- */
        form {
            display: flex;
            flex-direction: column;
        }

        label {
            font-weight: 600;
            color: #444;
            margin-bottom: 5px;
        }

        input, select {
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #3399ff;
            box-shadow: 0 0 6px rgba(51, 153, 255, 0.4);
        }

        /* ---------- BUTTON ---------- */
        button {
            background: #3399ff;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        button:hover {
            background: #267fd8;
            transform: translateY(-2px);
        }

        /* ---------- ERROR ---------- */
        .error {
            color: #d93025;
            font-weight: 600;
            margin-bottom: 10px;
            text-align: center;
        }

        /* ---------- FOOTER ---------- */
        p {
            margin-top: 20px;
            font-size: 14px;
            color: #555;
            text-align: center;
        }

        a {
            color: #007BFF;
            text-decoration: none;
            font-weight: 600;
        }

        a:hover {
            text-decoration: underline;
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 480px) {
            .main-heading {
                font-size: 24px;
                margin-bottom: 20px;
            }

            .register-container {
                padding: 30px 20px;
            }

            h2 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>

    <!-- Main Heading -->
    <h1 class="main-heading">Manhattan Employee Management</h1>

    <!-- Registration Form Card -->
    <div class="register-container">
        <h2>Employee Registration</h2>

        <p class="error">${error}</p>

        <form action="${pageContext.request.contextPath}/register" method="post">
            <label>First Name:</label>
            <input type="text" name="firstName" placeholder="Enter first name" required>

            <label>Last Name:</label>
            <input type="text" name="lastName" placeholder="Enter last name" required>

            <label>Age:</label>
            <input type="number" name="age" placeholder="Enter age" required min="18" max="100">

            <label>Address:</label>
            <input type="text" name="address" placeholder="Enter address" required>

            <label>Personal Email:</label>
            <input type="email" name="personalEmail" placeholder="Enter personal email" required>

            <label>Phone Number:</label>
            <input type="text" name="phone" placeholder="Enter 10-digit phone number" required pattern="[0-9]{10}">


            <label>Department Code:</label>
            <select name="deptCode" required>
                <option value="">-- Select Department --</option>
                <option value="HR">Human Resources</option>
                <option value="PSO">Pre-Sales Operations</option>
                <option value="CSO">Customer Success Operations</option>
                <option value="R&D">Research & Development</option>
            </select>

            <label>Role Code:</label>
            <select name="roleCode" required>
                <option value="">-- Select Role --</option>
                <option value="SDE-1">SDE-1</option>
                <option value="SDE-2">SDE-2</option>
                <option value="SDE-3">SDE-3</option>
                <option value="M1">Manager-1</option>
                <option value="M2">Manager-2</option>
                <option value="M3">Manager-3</option>
                <option value="L1">Level-1</option>
                <option value="L2">Level-2</option>
                <option value="L3">Level-3</option>
    <option value="L3">HR</option>
            </select>

            <button type="submit">Register</button>
        </form>

        <p>Already have an account?
            <a href="${pageContext.request.contextPath}/login">Login here</a>
        </p>
    </div>

</body>
</html>
 