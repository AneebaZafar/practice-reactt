import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";
import { FaUser, FaUserLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate(); 


  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("rememberedUser"));
    if (savedUser) {
      setFormData((prevData) => ({
        ...prevData,
        email: savedUser.email,
        password: savedUser.password
      }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRememberMe = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);

    if (!isChecked) {
      localStorage.removeItem("rememberedUser");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users/register", formData);
      alert(res.data.message);
      setIsRegister(false);
    } catch (err) {
      alert("Error registering user");
    }
  };

  const handleLogin = async (e) => {
    
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/users/login", formData);
      console.log(res.data.message);

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({
          email: formData.email,
          password: formData.password
        }));
      }navigate("/dashboard"); 
    } catch (err) {
      alert("Error logging in: " + (err.response?.data?.error || err.message));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      alert("Please enter your email first.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:5000/users/check-email", { email: formData.email });
  
      console.log("API Response:", res.data);  // Debugging Line
  
      if (res.data.exists) {
        setShowResetForm(true);
      } else {
        alert("Email not found. Please enter a registered email.");
      }
    } catch (err) {
      console.error("Error verifying email:", err.response?.data || err.message); // Debugging Line
      alert("Error verifying email. Check the console.");
    }
  };

  

  const handleResetPassword = async () => {
    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }
    if (!newPassword.trim()) {
      alert("Please enter a new password.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:5000/users/reset-password", {
        email: formData.email,
        newPassword,
      });
  
      console.log("Server Response:", res); // Log the entire response
  
      if (res.data?.success) {
        alert(res.data.message);
        setShowResetForm(false);
        setNewPassword("");
      } else {
        alert("Failed to reset password. Try again.");
      }
    } catch (err) {
      console.error("Error resetting password:", err.response?.data || err.message);
      alert("Error resetting password. Check the console.");
    }
  };
  
  

  fetch("http://localhost:5000/users/forgot-password", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: formData.email, newPassword }),
  });
  


  return (
    <div>
      <div className="app-name">Virtual Telescope</div>

      <div className={`wrapper ${isRegister ? "active" : ""}`}>
        <div className="form-container">
          {/* Login Form */}
          <div className="form-box login">
            {!showResetForm ? (
              <form onSubmit={handleLogin}>
                <h1>Sign In</h1>
                <div className="input-box">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <MdEmail className="icon" />
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <FaUserLock className="icon" />
                </div>
                <div className="remember-forgot">
                  <label>
                    <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} /> Remember me
                  </label>
                  <button onClick={handleForgotPassword}>
                    Forgot Password?
                  </button>
                </div>
                <button type="submit">Sign In</button>
                <div className="register-link">
                  <p>
                    Don't have an account?{" "}
                    <button onClick={() => setIsRegister(true)}>
                      Sign Up
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              // Reset Password Form
              <div className="reset-password-form">
                <h1>Reset Password</h1>
                <p>Enter a new password for {formData.email}</p>
                <div className="input-box">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <FaUserLock className="icon" />
                </div>
                <button onClick={handleResetPassword}>Reset Password</button>
                <button className="cancel-btn" onClick={() => setShowResetForm(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <div className="form-box register">
            <form onSubmit={handleRegister}>
              <h1>Sign Up</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <MdEmail className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <FaUserLock className="icon" />
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> I agree to the terms & conditions
                </label>
              </div>
              <button type="submit">Sign Up</button>
              <div className="register-link">
                <p>
                  Already have an account?{" "}
                  <button onClick={() => setIsRegister(false)}>
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
