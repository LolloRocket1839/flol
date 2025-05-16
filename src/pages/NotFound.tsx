
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-fintool-blue mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">Pagina non trovata</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Ci dispiace, la pagina che stai cercando non esiste o è stata spostata.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Torna alla home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/articoli">Esplora gli articoli</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
