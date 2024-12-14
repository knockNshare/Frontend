import React from 'react';

const InputField = ({ id, name, type, placeholder, value, onChange, autoComplete }) => {
  return (
    <div>
      <label htmlFor={id}>{placeholder}</label>
      <input
        id={id}             
        name={name}         
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
      />
    </div>
  );
};

export default InputField;
