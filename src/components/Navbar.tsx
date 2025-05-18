import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-fintool-blue">
                F<span className="text-fintool-teal transform -rotate-12 inline-block">L</span>o<span className="text-fintool-teal">L</span>
              </Link>
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
                {t('navigation.home')}
              </NavLink>
              <NavLink 
                to="/articoli" 
                className={({ isActive }) => 
                  isActive 
                    ? "px-3 py-2 text-sm font-medium text-fintool-teal" 
                    : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue"
                }
              >
                {t('navigation.articles')}
              </NavLink>
              <NavLink 
                to="/tool" 
                className={({ isActive }) => 
                  isActive 
                    ? "px-3 py-2 text-sm font-medium text-fintool-teal" 
                    : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue"
                }
              >
                {t('navigation.tools')}
              </NavLink>
              <NavLink 
                to="/biblioteca/thoughts" 
                className={({ isActive }) => 
                  isActive 
                    ? "px-3 py-2 text-sm font-medium text-fintool-teal flex items-center" 
                    : "px-3 py-2 text-sm font-medium text-gray-600 hover:text-fintool-blue flex items-center"
                }
              >
                <BookOpen className="h-4 w-4 mr-1" />
                {t('navigation.library')}
              </NavLink>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-fintool-blue focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
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
              {t('navigation.home')}
            </Link>
            <Link 
              to="/articoli" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.articles')}
            </Link>
            <Link 
              to="/tool" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.tools')}
            </Link>
            <Link 
              to="/biblioteca/thoughts" 
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-fintool-blue flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {t('navigation.library')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
