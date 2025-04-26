import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, username, onButtonClick, buttonLabel }) => {
  return (
    <div className="flex flex-col sm:flex-row h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar 
          username={username} 
          onButtonClick={onButtonClick} 
          buttonLabel={buttonLabel} 
        />
        <main className="p-2 sm:p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;