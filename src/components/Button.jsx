import React from "react";

const Button = ({ children, icon, className }) => {
  return (
    <button className={`flex items-center gap-2 ${className}`}>
      {children} {icon}
    </button>
  );
};

export default Button;
