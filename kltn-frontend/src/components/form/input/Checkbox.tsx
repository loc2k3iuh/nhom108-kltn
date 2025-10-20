import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
      />
      <label htmlFor={id} className="ml-3 text-sm text-gray-600">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;