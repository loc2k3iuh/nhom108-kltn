import React, { useState, useRef, useEffect } from 'react';

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (value: string) => {
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];
    onChange(newSelectedOptions);
  };

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

  const getSelectedLabels = () => {
    if (selectedOptions.length === 0) return 'Mặc định';
    return selectedOptions
      .map(val => options.find(opt => opt.value === val)?.label)
      .join(', ');
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <label className="text-sm text-gray-600 whitespace-nowrap">Sắp xếp theo:</label>
        <button
            onClick={handleToggle}
            className="ml-2 px-3 py-1 border rounded-md text-sm bg-white w-48 text-left flex justify-between items-center"
        >
            <span className="truncate">{getSelectedLabels()}</span>
            <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg border">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.value} className="px-3 py-2 hover:bg-gray-100">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.value)}
                    onChange={() => handleOptionClick(option.value)}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;