import React from 'react';

const Button = ({ text, onClick, type = "button", disabled, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded transition duration-300 ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;