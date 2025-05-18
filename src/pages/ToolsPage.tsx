
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { tools } from '@/data/tools';

const ToolsPage = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fintool-teal mb-4">Strumenti Finanziari</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Calcolatori interattivi per aiutarti nelle tue decisioni finanziarie
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.slug} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">{tool.icon}</div>
              <CardTitle>
                <Link to={`/tool/${tool.slug}`} className="hover:text-fintool-teal transition-colors">
                  {tool.name}
                </Link>
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{tool.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/tool/${tool.slug}`}>Usa lo strumento</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
