import React from 'react';

const Button = ({ text, onClick, type = "button", disabled, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300 w-full ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
