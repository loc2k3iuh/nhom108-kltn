import React from 'react';
import Header from './Header';
import Footer from './Footer';


const Layout: React.FC<{ children: React.ReactNode ; pageName?: string }> = ({ children, pageName }) => {

  return (
    <>
      
        <>          <Header />
          <main className="flex-grow bg-[#f0f0f0]">
            {children}
          </main>
          <Footer />
        </>
      
    </>
  );
};

export default Layout;