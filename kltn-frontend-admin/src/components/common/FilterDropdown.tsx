import React, { useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { LocalDropdownItem } from './LocalDropdownItem';

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

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const selectedCount = selectedIds.length;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center py-3 px-1 text-left font-semibold text-black dark:text-white border-b border-gray-200 dark:border-gray-700"
      >
        <span>
          {title} {selectedCount > 0 && `(${selectedCount})`}
        </span>
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

      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-full max-h-60 overflow-y-auto">
        <div className="p-2">
            {options.map(option => (
                <LocalDropdownItem
                    key={option.id}
                    onItemClick={() => onSelectionChange(option.id, !selectedIds.includes(option.id))}
                    className="flex items-center justify-between"
                >
                    <span>{option.name}</span>
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(option.id)}
                        readOnly
                        className="form-checkbox h-5 w-5 text-primary-600"
                    />
                </LocalDropdownItem>
            ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default FilterDropdown;
