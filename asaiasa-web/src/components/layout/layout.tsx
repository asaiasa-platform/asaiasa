import React, { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavbar && <Navbar />}
      <main className={`flex-grow ${showNavbar ? 'pt-[65px]' : ''}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
