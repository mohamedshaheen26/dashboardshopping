import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { API_BASE_URL } from "../config";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email !== "admin@example.com") {
      setError("Only the admin user can log in.");
      return;
    }

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true); // Show loader

    try {
      const response = await fetch(`${API_BASE_URL}/Users/Login`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);

        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError(
          "The username or password you entered is incorrect, please try again."
        );
      }
    } catch (err) {
      setError("Network error, please try again later.");
    }

    setLoading(false); // Hide loader
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state
  };

  return (
    <div className='container'>
      {loading && <Loader />} {/* Show Loader when loading */}
      <div className='main mx-auto'>
        <h1>Login</h1>
        {error && <div className='alert alert-danger'>{error}</div>}

        <form onSubmit={handleSubmit} id='loginForm'>
          <div className='mb-3'>
            <label className='form-label'>Email:</label>
            <input
              type='email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='mb-3'>
            <label className='form-label'>Password:</label>
            <div className='input-group mb-3'>
              <input
                type={showPassword ? "text" : "password"}
                className='form-control'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className='input-group-text'>
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  onClick={togglePasswordVisibility}
                ></i>
              </span>
            </div>
          </div>

          <button type='submit' className='btn btn-primary' disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
