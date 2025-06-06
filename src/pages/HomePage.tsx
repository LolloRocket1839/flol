
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  return <div className="space-y-12">
      <section className="py-16 bg-gradient-to-r from-fintool-blue to-fintool-blue-light text-white rounded-lg mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Educazione Finanziaria Semplice
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Strumenti interattivi e articoli informativi per prendere decisioni finanziarie consapevoli.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/articoli">Esplora gli articoli</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/tool">Scopri gli strumenti</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 p-3 bg-gradient-to-r from-white to-gray-50 shadow-sm rounded-lg">
            <span className="inline-block transform hover:scale-110 transition-transform">U</span>
            <span className="inline-block transform translate-y-0.5 hover:scale-110 transition-transform">n</span>
            <span className="inline-block transform hover:scale-110 transition-transform"> </span> 
            <span className="inline-block transform -translate-y-0.5 hover:scale-110 transition-transform">p</span>
            <span className="inline-block transform translate-y-0.5 hover:scale-110 transition-transform">o</span>
            <span className="inline-block transform hover:scale-110 transition-transform">'</span>
            <span className="inline-block transform"> </span> 
            <span className="inline-block transform hover:scale-110 transition-transform">d</span>
            <span className="inline-block transform -translate-y-0.5 hover:scale-110 transition-transform">i</span>
            <span className="inline-block transform hover:scale-110 transition-transform"> </span> 
            <span className="inline-block text-fintool-blue font-bold transform translate-y-0.5 hover:scale-110 transition-transform">e</span>
            <span className="inline-block text-fintool-blue font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">d</span>
            <span className="inline-block text-fintool-blue font-bold transform hover:scale-110 transition-transform">u</span>
            <span className="inline-block text-fintool-blue font-bold transform translate-y-0.5 hover:scale-110 transition-transform">c</span>
            <span className="inline-block text-fintool-blue font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">a</span>
            <span className="inline-block text-fintool-blue font-bold transform translate-y-0.5 hover:scale-110 transition-transform">z</span>
            <span className="inline-block text-fintool-blue font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">i</span>
            <span className="inline-block text-fintool-blue font-bold transform hover:scale-110 transition-transform">o</span>
            <span className="inline-block text-fintool-blue font-bold transform translate-y-0.5 hover:scale-110 transition-transform">n</span>
            <span className="inline-block text-fintool-blue font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">e</span>
            <span className="inline-block transform hover:scale-110 transition-transform"> </span> 
            <span className="inline-block text-fintool-teal font-bold transform translate-y-0.5 hover:scale-110 transition-transform">f</span>
            <span className="inline-block text-fintool-teal font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">i</span>
            <span className="inline-block text-fintool-teal font-bold transform hover:scale-110 transition-transform">n</span>
            <span className="inline-block text-fintool-teal font-bold transform translate-y-0.5 hover:scale-110 transition-transform">a</span>
            <span className="inline-block text-fintool-teal font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">n</span>
            <span className="inline-block text-fintool-teal font-bold transform translate-y-0.5 hover:scale-110 transition-transform">z</span>
            <span className="inline-block text-fintool-teal font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">i</span>
            <span className="inline-block text-fintool-teal font-bold transform translate-y-0.5 hover:scale-110 transition-transform">a</span>
            <span className="inline-block text-fintool-teal font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">r</span>
            <span className="inline-block text-fintool-teal font-bold transform translate-y-0.5 hover:scale-110 transition-transform">i</span>
            <span className="inline-block text-fintool-teal font-bold transform -translate-y-0.5 hover:scale-110 transition-transform">a</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-fintool-blue">Articoli</CardTitle>
                <CardDescription>
                  Approfondimenti sul mondo della finanza personale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  La nostra sezione articoli offre contenuti informativi su risparmio, 
                  investimenti, pianificazione finanziaria e molto altro, scritti in modo 
                  chiaro e accessibile.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="/articoli">Leggi gli articoli</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-fintool-teal">Strumenti</CardTitle>
                <CardDescription>
                  Calcolatori interattivi per le tue decisioni finanziarie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  I nostri strumenti interattivi ti aiutano a calcolare interessi composti,
                  pianificare l'indipendenza finanziaria, gestire il budget e molto altro ancora.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link to="/tool">Usa gli strumenti</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>;
};
export default HomePage;
