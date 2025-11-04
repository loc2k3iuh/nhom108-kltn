import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="form-search md:w-[calc(100%-370px)] w-[calc(100%-104px)] px-[8px]">
      <form onSubmit={handleSearchSubmit} className="md:relative">
        <input
          maxLength={128}
          type="text"
          name="q"
          autoComplete="off"
          placeholder="Thời trang Gen Z"
          className="input-search h-[40px] px-2 md:pt-0 md:pr-[80px] md:pb-0 md:pl-[24px] border md:border-[1px] md:border-solid md:border-[#CDCFD0] border-transparent bg-white focus:outline-none w-full rounded-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span
          className="button-search hidden md:flex absolute top-[calc(50%)] right-4 transform translate-y-[-50%] w-[72px] h-[30px] bg-[#C92127] justify-center items-center cursor-pointer rounded-md"
          onClick={handleSearchClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect className="fill-none" width="24" height="24" />
            <circle className="fill-none stroke-white stroke-2 stroke-round stroke-linejoin-round" cx="10" cy="10" r="7" />
            <line className="fill-none stroke-white stroke-2 stroke-round stroke-linejoin-round" x1="21" y1="21" x2="15" y2="15" />
          </svg>
        </span>
      </form>
    </div>
  );
};

export default SearchBar;
