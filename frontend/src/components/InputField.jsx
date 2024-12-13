import React from 'react';

const InputField = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
    />
  );
};

export default InputField;
