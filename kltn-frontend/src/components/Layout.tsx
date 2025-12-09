import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './chatbot/Chatbot';

const Layout: React.FC<{ children: React.ReactNode; pageName?: string }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow bg-[#f0f0f0] py-8">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          {children}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default Layout;
