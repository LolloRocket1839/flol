
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuthStore();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-fintool-blue">FinTool</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? "px-3 py-2 text-sm font-medium text-fintool-teal" 
                    : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue"
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/articoli" 
                className={({ isActive }) => 
                  isActive 
                    ? "px-3 py-2 text-sm font-medium text-fintool-teal" 
                    : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue"
                }
              >
                Articoli
              </NavLink>
              <NavLink 
                to="/tool" 
                className={({ isActive }) => 
                  isActive 
                    ? "px-3 py-2 text-sm font-medium text-fintool-teal" 
                    : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue"
                }
              >
                Strumenti
              </NavLink>
              {isAdmin && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    isActive 
                      ? "px-3 py-2 text-sm font-medium text-fintool-teal" 
                      : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue"
                  }
                >
                  Admin
                </NavLink>
              )}
              {!user && (
                <NavLink 
                  to="/auth" 
                  className={({ isActive }) => 
                    isActive 
                      ? "px-3 py-2 text-sm font-medium text-fintool-teal" 
                      : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue"
                  }
                >
                  Accedi
                </NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-fintool-blue focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/articoli" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Articoli
            </Link>
            <Link 
              to="/tool" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Strumenti
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {!user && (
              <Link 
                to="/auth" 
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue"
                onClick={() => setIsMenuOpen(false)}
              >
                Accedi
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
