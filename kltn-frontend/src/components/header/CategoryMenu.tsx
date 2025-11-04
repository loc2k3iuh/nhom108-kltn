import React from 'react';
import ProductCategories from './ProductCategories';

interface CategoryMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="w-auto md:w-[200px] flex justify-end">
      <div className="cursor-pointer flex items-center relative" onClick={onToggle}>
        <svg
          className="fill-[#cdcfd0]"
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
        >
          <rect
            className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5] stroke-linecap-round stroke-linejoin-round"
            width="10"
            height="10"
            rx="1.667"
            transform="translate(6.667 6.667)"
          />
          <rect
            className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5] stroke-linecap-round stroke-linejoin-round"
            width="10"
            height="10"
            rx="1.667"
            transform="translate(6.667 23.333)"
          />
          <rect
            className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5] stroke-linecap-round stroke-linejoin-round"
            width="10"
            height="10"
            rx="1.667"
            transform="translate(23.333 23.333)"
          />
          <circle
            className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5]"
            cx="5"
            cy="5"
            r="5"
            transform="translate(23.333 6.667)"
          />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <rect className="fill-none" width="16" height="16" />
          <path
            className="fill-none stroke-white md:stroke-[#9E9E9E] stroke-[2] stroke-linecap-round stroke-linejoin-round"
            d="M6,9l3.945,3.945L13.891,9"
          />
        </svg>
      </div>
      <div
        className={`catalog_menu_dropdown absolute left-0 right-0 md:top-[68px] ${
          isOpen ? 'flex' : 'hidden'
        } w-full h-full justify-center items-center bg-transparent md:bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-100`}
      >
        <div className="w-full md:max-w-7xl bg-[#C92127] md:bg-white rounded-bl-[8px] rounded-br-[8px] pt-[24px] px-[12px] pb-[16px] z-10 top-0 absolute">
          <ProductCategories handleClick={onToggle} isOpen={isOpen} />
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
