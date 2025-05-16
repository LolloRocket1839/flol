
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-fintool-blue">
              Fin<span className="text-fintool-teal">Tool</span>
            </span>
          </Link>
        </div>
        <nav className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/articoli">Articoli</Link>
          </Button>
          <Button asChild>
            <Link to="/tool">Strumenti</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
