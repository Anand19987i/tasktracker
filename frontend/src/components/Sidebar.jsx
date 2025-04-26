import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-black  rounded-lg"
      >
        {!isOpen && <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          z-40`}
      >
        <h1 className="text-2xl font-bold mb-8">TaskTracker</h1>
        
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <nav className="flex-1 space-y-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:text-blue-400 transition p-2 rounded-lg hover:bg-slate-800"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to={`/favourite/${user?.id}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:text-blue-400 transition p-2 rounded-lg hover:bg-slate-800"
          >
            <FolderKanban className="w-5 h-5" />
            Favourites
          </Link>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="mt-auto text-sm flex gap-2 items-center hover:text-red-400 p-2 rounded-lg hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;