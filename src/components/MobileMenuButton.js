import React from "react";
import { FaBars } from "react-icons/fa";

const MobileMenuButton = ({ onClick, isActive }) => {
  return (
    <button 
      className="menu-toggle" 
      onClick={onClick}
      aria-label={isActive ? "Close menu" : "Open menu"}
    >
      <FaBars size={20} />
    </button>
  );
};

export default MobileMenuButton;