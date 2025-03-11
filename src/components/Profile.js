import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const Profile = ({ onLogin, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const dropdownRef = useRef(null);

  // Check for user data in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData.user));
    setUser(userData.user);
    setShowLoginModal(false);
    
    // Pass the complete userData object
    if (onLogin) {
      onLogin(userData);
    }
  };
  
  const handleRegister = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData.user));
    setUser(userData.user);
    setShowRegisterModal(false);
    
    // Pass the complete userData object
    if (onLogin) {
      onLogin(userData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    
    // Call the onLogout prop to update parent component state
    if (onLogout) {
      onLogout();
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="profile-container" ref={dropdownRef}>
      <div className="profile-icon-container" onClick={toggleDropdown}>
        <FaUserCircle size={35} className="profile-icon" />
      </div>
      
      {showDropdown && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-content">
            {user ? (
              <div className="profile-info">
                <p><strong>Name:</strong> {user.name}</p>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="profile-actions">
                <button className="btn btn-primary" onClick={() => setShowLoginModal(true)}>
                  Login
                </button>
                <button className="btn btn-secondary ms-2" onClick={() => setShowRegisterModal(true)}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal show={showLoginModal} onHide={() => setShowLoginModal(false)} onLogin={handleLogin} />

      {/* Register Modal */}
      <RegisterModal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} onRegister={handleRegister} />
    </div>
  );
};

export default Profile;