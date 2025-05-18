
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getToolBySlug, tools } from '@/data/tools';

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const tool = getToolBySlug(slug || '');
  
  if (!tool) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Strumento non trovato</h1>
        <Button onClick={() => navigate('/tool')}>
          Torna agli strumenti
        </Button>
      </div>
    );
  }

  // Instead of using a switch statement, we can directly use the component from the tool
  const ToolComponent = tool.component;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/tool')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Torna agli strumenti</span>
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">{tool.icon}</div>
        <h1 className="text-3xl font-bold text-fintool-teal mb-2">{tool.name}</h1>
        <p className="text-gray-600">{tool.description}</p>
      </div>
      
      <ToolComponent />
    </div>
  );
};

export default ToolPage;
