
import InterestCalculator from '@/components/tools/InterestCalculator';
import MortgageCalculator from '@/components/tools/MortgageCalculator';
import FireCalculator from '@/components/tools/FireCalculator';
import BudgetCalculator from '@/components/tools/BudgetCalculator';
import FireCalculatorAdvanced from '@/components/tools/FireCalculatorAdvanced';
import CompoundInterestAdvancedCalculator from '@/components/tools/CompoundInterestAdvancedCalculator';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  component: React.ComponentType<any>;
  icon?: string;
}

export const tools: Tool[] = [
  {
    id: 'interest-calculator',
    name: 'Calcolatore di Interesse',
    slug: 'interesse-composto',
    description: 'Calcola quanto crescerà il tuo denaro nel tempo',
    component: InterestCalculator,
    icon: '💰',
  },
  {
    id: 'compound-interest-advanced',
    name: 'Interesse Composto Avanzato',
    slug: 'interesse-composto-avanzato',
    description: 'Simulazione avanzata con diverse frequenze di contribuzione',
    component: CompoundInterestAdvancedCalculator,
    icon: '📈',
  },
  {
    id: 'mortgage-calculator',
    name: 'Calcolatore di Mutuo',
    slug: 'mutuo',
    description: 'Calcola la rata del mutuo e pianifica il tuo acquisto',
    component: MortgageCalculator,
    icon: '🏠',
  },
  {
    id: 'fire-calculator',
    name: 'FIRE Calculator',
    slug: 'fire-calculator',
    description: 'Pianifica la tua indipendenza finanziaria',
    component: FireCalculator,
    icon: '🔥',
  },
  {
    id: 'fire-advanced',
    name: 'FIRE Avanzato',
    slug: 'fire-avanzato',
    description: 'Simulazione dettagliata del percorso verso la libertà finanziaria',
    component: FireCalculatorAdvanced,
    icon: '⚡',
  },
  {
    id: 'budget-calculator',
    name: 'Budget Mensile',
    slug: 'budget-mensile',
    description: 'Pianifica e ottimizza le tue spese mensili',
    component: BudgetCalculator,
    icon: '📊',
  },
];

export const getToolBySlug = (slug: string): Tool | undefined =>
  tools.find((tool) => tool.slug === slug);
