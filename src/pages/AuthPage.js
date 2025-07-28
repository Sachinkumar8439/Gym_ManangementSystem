import React, { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { appwriteAuth } from "../Auth/Appwriteauth";

const LoginPage = ({user,setuser}) => {
  const [loading,setloading] = useState(false);
    const navigate = useNavigate();
    const [formdata,setformdata

    ]  = useState({email:"",password:"",name:"",mobile:"",confirmpassword:""})
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log(formdata);
    setloading(true);
    const response = await appwriteAuth.login(formdata.email,formdata.password)
    if(response.success){
      setuser(response.user);
      navigate("/admin")

    }else{
      alert(response.message)
    }
    setloading(false);
    console.log(response);

    // console.log(formdata);


    // Login logic here
  };

  const handleRegisterSubmit =async (e) => {
    e.preventDefault();
    console.log(formdata)
    const response = await appwriteAuth.signUp(formdata.email,formdata.password,formdata.name,formdata.mobile)
    console.log(response);
    if(response.success){
      alert(response.message);
    }
    // Registration logic here
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo">
          <i className="fas fa-dumbbell"></i>
          <h1>FLEXFIT</h1>
        </div>
        <h2>Transform Your Body, Transform Your Life</h2>
        <p>Join thousands of members achieving their fitness goals with our state-of-the-art facilities and expert trainers.</p>
        
        <div className="features">
          <div className="feature">
            <i className="fas fa-calendar-check"></i>
            <div>
              <h4>Class Scheduling</h4>
              <p>Book and manage your classes with ease</p>
            </div>
          </div>
          <div className="feature">
            <i className="fas fa-chart-line"></i>
            <div>
              <h4>Progress Tracking</h4>
              <p>Monitor your fitness journey with detailed analytics</p>
            </div>
          </div>
          <div className="feature">
            <i className="fas fa-user-friends"></i>
            <div>
              <h4>Trainer Management</h4>
              <p>Connect with certified fitness professionals</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="right-panel">
        <div className="form-container">
          <div className="tabs">
            <div 
              className={`tab ${activeTab === "login" ? "active" : ""}`} 
              onClick={() => handleTabChange("login")}
            >
              Login
            </div>
            <div 
              className={`tab ${activeTab === "register" ? "active" : ""}`} 
              onClick={() => handleTabChange("register")}
            >
              Register
            </div>
          </div>
          
          {/* Login Form */}
          <div className={`form ${activeTab === "login" ? "active" : ""}`}>
            <h3>Welcome Back!</h3>
            
            <div className="social-login">
              <div className="social-btn google">
                <i className="fab fa-google"></i>
                <span>Google</span>
              </div>
              <div className="social-btn facebook">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </div>
              <div className="social-btn apple">
                <i className="fab fa-apple"></i>
                <span>Apple</span>
              </div>
            </div>
            
            <div className="divider">
              <span>or continue with email</span>
            </div>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  value={formdata.email} 
                  placeholder="Enter your email" 
                  required 
                  onChange={(e) => setformdata
                    (prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="Enter your password" 
                    required
                    onChange={(e) => setformdata
                      (prev => ({ ...prev, password: e.target.value }))} 
                  />
                  <i 
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>
              
              <div className="checkbox-group">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              
              <button style={{background:loading && "silver"}} disabled={loading} type="submit" className="btn">{loading?"Loging in....":"Login Acoount"}</button>
              
              <div className="forgot-password">
                <a href="#">Forgot your password?</a>
              </div>
            </form>
          </div>
          
          {/* Register Form */}
          <div className={`form ${activeTab === "register" ? "active" : ""}`}>
            <h3>Create Account</h3>
            <p className="register-subtitle">Join our fitness community today</p>
            
            <form onSubmit={handleRegisterSubmit}>
              <div className="input-group">
                <label htmlFor="fullname">Full Name</label>
                <input 
                  type="text" 
                  id="fullname" 
                  placeholder="Enter your full name" 
                  required
                  value={formdata.name} 
                  onChange={(e) => setformdata
                    (prev => ({ ...prev, name: e.target.value }))}

                />
              </div>
              
              <div className="input-group">
                <label htmlFor="reg-email">Email Address</label>
                <input 
                  type="email" 
                  id="reg-email" 
                  placeholder="Enter your email" 
                  required
                  value={formdata.email} 
                  onChange={(e) => setformdata
                    (prev => ({ ...prev, email: e.target.value }))}

                />
              </div>
              
              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="Enter your phone number" 
                  required
                  value={formdata.mobile}
                  onChange={(e) => setformdata
                    (prev => ({ ...prev, mobile: e.target.value }))}
 
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="reg-password">Password</label>
                <div className="password-container">
                  <input 
                    type={showRegPassword ? "text" : "password"} 
                    id="reg-password" 
                    placeholder="Create a password" 
                    required
                    value={formdata.password}
                    onChange={(e) => setformdata
                      (prev => ({ ...prev, password: e.target.value }))}
 
                  />
                  <i 
                    className={`fas ${showRegPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  ></i>
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="password-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirm-password" 
                    placeholder="Confirm your password" 
                    required
                    value={formdata.confirmpassword}
                    onChange={(e) => setformdata
                      (prev => ({ ...prev, confirmpassword: e.target.value }))}
 
                  />
                  <i 
                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  ></i>
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="membership">Membership Type</label>
                <select id="membership" required>
                  <option value="">Select membership</option>
                  <option value="basic">Basic ($49/month)</option>
                  <option value="premium">Premium ($79/month)</option>
                  <option value="vip">VIP ($129/month)</option>
                </select>
              </div>
              
              <div className="checkbox-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>
              
              <button type="submit" className="btn">Create Account</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;