import React, { useState, useRef, useEffect } from 'react';
import Checkbox from '../form/input/Checkbox';

interface Option {
  id: number;
  name: string;
}

interface FilterDropdownProps {
  title: string;
  options: Option[];
  selectedIds: number[];
  onSelectionChange: (id: number, isChecked: boolean) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ title, options, selectedIds, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedCount = selectedIds.length;

  return (
    <div className="relative border-b" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center py-3 px-1 text-left"
      >
        <h3 className="font-semibold">
          {title} {selectedCount > 0 && `(${selectedCount})`}
        </h3>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? '-rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-1 w-full bg-white rounded-md shadow-lg z-10 p-4 max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {options.map(option => (
              <Checkbox
                key={option.id}
                id={`${title}-${option.id}`}
                label={option.name}
                checked={selectedIds.includes(option.id)}
                onChange={(isChecked) => onSelectionChange(option.id, isChecked)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;