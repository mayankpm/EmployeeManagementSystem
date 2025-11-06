<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Login</title>

    <style>
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

  body {
      font-family: 'Poppins', Arial, sans-serif;
      background: linear-gradient(135deg, #b3e5fc, #e1f5fe);
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
  }

        
  .main-heading {
      color: #000; 
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 30px;
      letter-spacing: 1px;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  }


     
        .login-container {
            background-color: #fff;
            width: 100%;
            max-width: 400px;
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        
        h2 {
            color: #333;
            margin-bottom: 20px;
        }

       
        form {
            display: flex;
            flex-direction: column;
            text-align: left;
        }

        label {
            font-weight: 600;
            color: #444;
            margin-bottom: 5px;
        }

        input {
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: #007BFF;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
        }

        /* ---------- BUTTON ---------- */
        button {
            background: #007BFF;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        button:hover {
            background: #0056b3;
            transform: translateY(-2px);
        }

        /* ---------- ERROR MESSAGE ---------- */
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

            .login-container {
                padding: 30px 20px;
                margin: 10px;
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

    <!-- Login Card -->
    <div class="login-container">
        <h2>Employee Login</h2>

        <p class="error">${error}</p>

        <form action="${pageContext.request.contextPath}/login" method="post">
            <label for="personalEmail">Personal Email</label>
            <input type="email" id="personalEmail" name="personalEmail" placeholder="Enter your email" required>

            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>

            <button type="submit">Login</button>
        </form>

        <p>Don't have an account? 
            <a href="${pageContext.request.contextPath}/register">Register here</a>
        </p>
    </div>
</body>
</html>
 