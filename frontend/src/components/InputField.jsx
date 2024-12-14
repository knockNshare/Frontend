import React from 'react';

const InputField = ({ id, name, type, placeholder, value, onChange, autoComplete, className = "" }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`border rounded p-3 focus:ring-2 focus:ring-blue-400 w-full mb-4 ${className}`}
    />
  );
};

export default InputField;
