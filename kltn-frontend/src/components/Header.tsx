import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Logo from './header/Logo';
import CategoryMenu from './header/CategoryMenu';
import SearchBar from './header/SearchBar';
import NotificationMenu from './header/NotificationMenu';
import CartIcon from './header/CartIcon';
import UserMenu from './header/UserMenu';
  
const Header: React.FC = () => {
  const { authUser } = useAuthStore();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('vuvisa_access_token');
      const userData = localStorage.getItem('vuvisa_user_data');

      if (token && userData) {
        setCartItemCount(3);
      } else {
        setCartItemCount(0);
      }
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const handleCategoryToggle = () => {
    setIsCategoryOpen((prev) => !prev);
    setIsUserMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen((prev) => !prev);
    setIsCategoryOpen(false);
  };

  return (
    <nav className="bg-white">
      <div className="max-w-7xl h-auto md:h-[68px] mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between bg-[#C92127] md:bg-white gap-3 md:gap-0 pt-2 cursor-pointer">
        <Logo />

        <div className="flex items-center w-full justify-between">
          <CategoryMenu isOpen={isCategoryOpen} onToggle={handleCategoryToggle} />

          <SearchBar />

          <div className="flex items-center justify-between md:w-[480px] pl-0 md:pl-[24px] gap-2 md:gap-3">
            <NotificationMenu authUser={authUser} />

            <CartIcon cartItemCount={cartItemCount} />

            <div className="flex flex-col cursor-pointer justify-center items-center group">
              <UserMenu isOpen={isUserMenuOpen} authUser={authUser} onToggle={handleUserMenuToggle} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;