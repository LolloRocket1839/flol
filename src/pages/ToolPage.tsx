
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tools } from '@/data/tools';
import InterestCalculator from '@/components/tools/InterestCalculator';
import FireCalculator from '@/components/tools/FireCalculator';
import FireCalculatorAdvanced from '@/components/tools/FireCalculatorAdvanced';

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const tool = tools.find(t => t.slug === slug);
  
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

  const renderTool = () => {
    switch(slug) {
      case 'interesse-composto':
        return <InterestCalculator />;
      case 'fire-calculator':
        return <FireCalculator />;
      case 'fire-calculator-advanced':
        return <FireCalculatorAdvanced />;
      default:
        return (
          <div className="text-center py-8">
            <p>Strumento non implementato</p>
          </div>
        );
    }
  };

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
        <h1 className="text-3xl font-bold text-fintool-teal mb-2">{tool.title}</h1>
        <p className="text-gray-600">{tool.description}</p>
      </div>
      
      {renderTool()}
    </div>
  );
};

export default ToolPage;
