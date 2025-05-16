import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-fintool-blue text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">FLoL</h3>
            <p className="text-gray-300">
              Strumenti e articoli per l'educazione finanziaria.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Sezioni</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/articoli" className="text-gray-300 hover:text-white">
                  Articoli
                </Link>
              </li>
              <li>
                <Link to="/tool" className="text-gray-300 hover:text-white">
                  Strumenti
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Informazioni</h3>
            <p className="text-gray-300">FLoL è un'applicazione open source per l'educazione finanziaria.</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} <span className="font-bold text-white">F<span className="text-fintool-teal">L</span>o<span className="text-fintool-teal">L</span></span> <span className="text-sm italic">a Lorenzo Oni-Joseph production</span></p>
        </div>
      </div>
    </footer>;
};
export default Footer;