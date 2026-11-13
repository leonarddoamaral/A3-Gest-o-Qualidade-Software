import React from 'react';
import './checkbox.css';

interface CheckboxProps {
  id: string;
  text: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ id, text, checked, onChange }: CheckboxProps) {
  return (
    <div className="checkbox-container">
      <input 
        type="checkbox" 
        id={id} 
        checked={checked} 
        onChange={onChange} 
        className="custom-checkbox"
      />
      <label htmlFor={id} className="checkbox-label">
        {text}
      </label>
    </div>
  );
}