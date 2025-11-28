import React from 'react';
import { useNavigate } from 'react-router-dom';
import vuvisaLogo from '@/assets/img/logo.svg';

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center">
      <span onClick={() => navigate("/")} className="cursor-pointer">
        <img src={vuvisaLogo} alt="Vuvia Logo" className="h-auto w-[130px] md:w-[200px]" />
      </span>
    </div>
  );
};

export default Logo;
