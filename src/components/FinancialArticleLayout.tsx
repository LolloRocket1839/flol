
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calculator, 
  Umbrella, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  BarChart2, 
  DollarSign, 
  Target, 
  Award, 
  Percent, 
  Clipboard, 
  Briefcase,
  BarChart,
  Layers,
  Scale,
  Activity,
  Shield,
} from 'lucide-react';

interface FinancialArticleLayoutProps {
  title: string;
  content: string;
  icon?: string;
  date?: string;
  category?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  calculator: <Calculator className="h-8 w-8 text-fintool-blue" />,
  umbrella: <Umbrella className="h-8 w-8 text-fintool-blue" />,
  trend: <TrendingUp className="h-8 w-8 text-fintool-blue" />,
  pie: <PieChart className="h-8 w-8 text-fintool-blue" />,
  card: <CreditCard className="h-8 w-8 text-fintool-blue" />,
  chart: <BarChart2 className="h-8 w-8 text-fintool-blue" />,
  dollar: <DollarSign className="h-8 w-8 text-fintool-blue" />,
  target: <Target className="h-8 w-8 text-fintool-blue" />,
  award: <Award className="h-8 w-8 text-fintool-blue" />,
  percent: <Percent className="h-8 w-8 text-fintool-blue" />,
  clipboard: <Clipboard className="h-8 w-8 text-fintool-blue" />,
  briefcase: <Briefcase className="h-8 w-8 text-fintool-blue" />,
  bar: <BarChart className="h-8 w-8 text-fintool-blue" />,
  layers: <Layers className="h-8 w-8 text-fintool-blue" />,
  scale: <Scale className="h-8 w-8 text-fintool-blue" />,
  activity: <Activity className="h-8 w-8 text-fintool-blue" />,
  shield: <Shield className="h-8 w-8 text-fintool-blue" />,
};

const FinancialArticleLayout: React.FC<FinancialArticleLayoutProps> = ({
  title,
  content,
  icon = 'chart',
  date,
  category,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center mb-8">
        <div className="mr-4 bg-blue-50 p-4 rounded-full">
          {iconMap[icon] || iconMap['chart']}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#004D80]">{title}</h1>
          {category && (
            <div className="text-sm text-gray-500 mt-1">
              {t('article.category')}: {category}
            </div>
          )}
          {date && (
            <div className="text-sm text-gray-500 mt-1">
              {t('article.published')} {date}
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <div 
          className="financial-concept-content"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-[#004D80] mb-4">
            {t('article.keyTakeaways')}
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('article.takeaway1')}</li>
            <li>{t('article.takeaway2')}</li>
            <li>{t('article.takeaway3')}</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#004D80] mb-4">
            {t('article.practicalAction')}
          </h3>
          <p>{t('article.actionDescription')}</p>
          <div className="mt-4">
            <a 
              href="#" 
              className="inline-block bg-[#004D80] text-white px-6 py-3 rounded-md hover:bg-[#00396d] transition-colors"
            >
              {t('article.startNow')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialArticleLayout;
