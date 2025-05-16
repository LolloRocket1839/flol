import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PieChart, LineChart, BarChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Line } from 'recharts';
import { Plus, Minus, DollarSign, Trash2, ChevronDown, ChevronUp, Home, Car, ShoppingCart, Heart, Film, PiggyBank, CreditCard, Package, Info } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

// Utility function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

// Income interfaces
interface Income {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
}

// Expense interfaces
interface Expense {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  category: string;
  isFixed: boolean;
  priority: 'essential' | 'important' | 'discretionary';
}

// Category interface with icon mapping
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  { id: 'housing', name: 'Casa', icon: <Home className="h-5 w-5" />, color: '#1E88E5' },
  { id: 'transportation', name: 'Trasporti', icon: <Car className="h-5 w-5" />, color: '#43A047' },
  { id: 'food', name: 'Alimentazione', icon: <ShoppingCart className="h-5 w-5" />, color: '#FB8C00' },
  { id: 'health', name: 'Salute', icon: <Heart className="h-5 w-5" />, color: '#E53935' },
  { id: 'entertainment', name: 'Intrattenimento', icon: <Film className="h-5 w-5" />, color: '#8E24AA' },
  { id: 'savings', name: 'Risparmio', icon: <PiggyBank className="h-5 w-5" />, color: '#3949AB' },
  { id: 'debts', name: 'Debiti', icon: <CreditCard className="h-5 w-5" />, color: '#D81B60' },
  { id: 'other', name: 'Altro', icon: <Package className="h-5 w-5" />, color: '#757575' },
];

const BudgetCalculator: React.FC = () => {
  // State for main income
  const [mainIncome, setMainIncome] = useState({
    amount: 0,
    frequency: 'monthly',
    isGross: false,
    description: 'Stipendio'
  });

  // State for additional incomes
  const [additionalIncomes, setAdditionalIncomes] = useState<Income[]>([]);

  // State for expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // State for budget method
  const [budgetMethod, setBudgetMethod] = useState('50-30-20');
  
  // Custom budget allocations (for the 50-30-20 method)
  const [budgetAllocations, setBudgetAllocations] = useState({
    necessities: 50,
    wants: 30,
    savings: 20
  });

  // Current active tab
  const [activeTab, setActiveTab] = useState('overview');

  // Calculation results
  const [results, setResults] = useState({
    totalMonthlyIncome: 0,
    totalMonthlyExpenses: 0,
    balance: 0,
    savingsRate: 0,
    categoryTotals: {} as Record<string, number>,
    budgetAllocated: {
      necessities: 0,
      wants: 0,
      savings: 0
    }
  });

  // Function to add a new income
  const addIncome = () => {
    const newIncome: Income = {
      id: `income-${Date.now()}`,
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true
    };
    setAdditionalIncomes([...additionalIncomes, newIncome]);
  };

  // Function to update an income
  const updateIncome = (id: string, field: keyof Income, value: any) => {
    setAdditionalIncomes(
      additionalIncomes.map(income => 
        income.id === id ? { ...income, [field]: value } : income
      )
    );
  };

  // Function to remove an income
  const removeIncome = (id: string) => {
    setAdditionalIncomes(additionalIncomes.filter(income => income.id !== id));
  };

  // Function to add a new expense
  const addExpense = (category: string) => {
    const newExpense: Expense = {
      id: `expense-${Date.now()}`,
      description: '',
      amount: 0,
      frequency: 'monthly',
      category,
      isFixed: true,
      priority: 'essential'
    };
    setExpenses([...expenses, newExpense]);
  };

  // Function to update an expense
  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(
      expenses.map(expense => 
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  // Function to remove an expense
  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Function to normalize frequencies to monthly values
  const normalizeFrequency = (amount: number, frequency: string): number => {
    switch (frequency) {
      case 'weekly':
        return amount * 4.33;
      case 'biweekly':
        return amount * 2.17;
      case 'annual':
        return amount / 12;
      default:
        return amount;
    }
  };

  // Calculate all budget results
  useEffect(() => {
    // Calculate total income (normalized to monthly)
    const mainIncomeMonthly = normalizeFrequency(mainIncome.amount, mainIncome.frequency);
    const additionalIncomesMonthly = additionalIncomes.reduce(
      (total, income) => total + normalizeFrequency(income.amount, income.frequency),
      0
    );
    const totalMonthlyIncome = mainIncomeMonthly + additionalIncomesMonthly;

    // Calculate expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category;
      const monthlyAmount = normalizeFrequency(expense.amount, expense.frequency);
      acc[category] = (acc[category] || 0) + monthlyAmount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate total monthly expenses
    const totalMonthlyExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

    // Calculate balance and savings rate
    const balance = totalMonthlyIncome - totalMonthlyExpenses;
    const savingsRate = totalMonthlyIncome > 0 ? (balance / totalMonthlyIncome) * 100 : 0;

    // Calculate budget allocations based on method
    const budgetAllocated = {
      necessities: totalMonthlyIncome * (budgetAllocations.necessities / 100),
      wants: totalMonthlyIncome * (budgetAllocations.wants / 100),
      savings: totalMonthlyIncome * (budgetAllocations.savings / 100)
    };

    // Update results
    setResults({
      totalMonthlyIncome,
      totalMonthlyExpenses,
      balance,
      savingsRate,
      categoryTotals: expensesByCategory,
      budgetAllocated
    });
  }, [mainIncome, additionalIncomes, expenses, budgetAllocations]);

  // Data for pie chart
  const pieChartData = Object.entries(results.categoryTotals).map(([category, amount]) => {
    const categoryInfo = categories.find(c => c.id === category) || { name: category, color: '#666666' };
    return {
      name: categoryInfo.name,
      value: amount,
      color: categoryInfo.color
    };
  });

  // Data for budget allocation chart
  const budgetAllocationData = [
    {
      name: 'Necessità',
      value: budgetAllocations.necessities,
      color: '#1E88E5'
    },
    {
      name: 'Desideri',
      value: budgetAllocations.wants,
      color: '#8E24AA'
    },
    {
      name: 'Risparmio',
      value: budgetAllocations.savings,
      color: '#43A047'
    }
  ];

  // Handle budget allocation slider changes
  const handleNecessitiesChange = (values: number[]) => {
    const newNecessities = values[0];
    // Adjust wants and savings proportionally
    const remainingPercentage = 100 - newNecessities;
    const currentRemainder = budgetAllocations.wants + budgetAllocations.savings;
    const newWants = currentRemainder > 0 
      ? Math.round((budgetAllocations.wants / currentRemainder) * remainingPercentage)
      : Math.round(remainingPercentage / 2);
    const newSavings = remainingPercentage - newWants;
    
    setBudgetAllocations({
      necessities: newNecessities,
      wants: newWants,
      savings: newSavings
    });
  };

  const handleWantsChange = (values: number[]) => {
    const newWants = values[0];
    // Keep necessities the same, adjust only savings
    const newSavings = 100 - budgetAllocations.necessities - newWants;
    if (newSavings >= 0) {
      setBudgetAllocations({
        necessities: budgetAllocations.necessities,
        wants: newWants,
        savings: newSavings
      });
    }
  };

  const handleSavingsChange = (values: number[]) => {
    const newSavings = values[0];
    // Keep necessities the same, adjust only wants
    const newWants = 100 - budgetAllocations.necessities - newSavings;
    if (newWants >= 0) {
      setBudgetAllocations({
        necessities: budgetAllocations.necessities,
        wants: newWants,
        savings: newSavings
      });
    }
  };

  // Income frequency options
  const frequencyOptions = [
    { value: 'monthly', label: 'Mensile' },
    { value: 'biweekly', label: 'Quindicinale' },
    { value: 'weekly', label: 'Settimanale' },
    { value: 'annual', label: 'Annuale' }
  ];

  // Priority options
  const priorityOptions = [
    { value: 'essential', label: 'Essenziale' },
    { value: 'important', label: 'Importante' },
    { value: 'discretionary', label: 'Discrezionale' }
  ];

  // Check if expenses exceed allocated budget for category
  const getCategoryBudgetStatus = (category: string) => {
    // Map categories to budget types
    const categoryToBudgetType: Record<string, keyof typeof results.budgetAllocated> = {
      housing: 'necessities',
      transportation: 'necessities',
      food: 'necessities',
      health: 'necessities',
      entertainment: 'wants',
      savings: 'savings',
      debts: 'necessities',
      other: 'wants'
    };

    const budgetType = categoryToBudgetType[category];
    const totalForCategory = results.categoryTotals[category] || 0;
    const budgetForType = results.budgetAllocated[budgetType];
    
    // Calculate all categories of this type
    const allCategoriesOfType = Object.entries(categoryToBudgetType)
      .filter(([_, type]) => type === budgetType)
      .map(([cat, _]) => cat);
      
    const totalForType = allCategoriesOfType.reduce(
      (sum, cat) => sum + (results.categoryTotals[cat] || 0), 
      0
    );
    
    // If the total for this budget type exceeds the allocation, check if this category is contributing too much
    if (totalForType > budgetForType) {
      // Calculate "fair share" for this category
      const categoriesCount = allCategoriesOfType.length;
      const fairShare = budgetForType / categoriesCount;
      
      if (totalForCategory > fairShare) {
        return 'over';
      }
    }
    
    return 'under';
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Calcolatore Budget Mensile</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="income">Entrate</TabsTrigger>
          <TabsTrigger value="expenses">Uscite</TabsTrigger>
          <TabsTrigger value="analysis">Analisi</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income Summary Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                    Entrate Totali
                  </h3>
                  <span className="text-2xl font-bold text-green-500">
                    {formatCurrency(results.totalMonthlyIncome)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Entrate mensili da tutte le fonti
                </div>
              </CardContent>
            </Card>

            {/* Expenses Summary Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Minus className="h-5 w-5 text-red-500 mr-2" />
                    Uscite Totali
                  </h3>
                  <span className="text-2xl font-bold text-red-500">
                    {formatCurrency(results.totalMonthlyExpenses)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Spese mensili in tutte le categorie
                </div>
              </CardContent>
            </Card>

            {/* Balance Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Bilancio</h3>
                  <span className={`text-2xl font-bold ${results.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(results.balance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Tasso di risparmio
                  </span>
                  <Badge variant={results.savingsRate >= 20 ? "default" : "destructive"}>
                    {results.savingsRate.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Budget Method Card */}
            <Card className="md:col-span-3">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Metodo di Budget 50/30/20</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Necessities */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Necessità ({budgetAllocations.necessities}%)</Label>
                      <span>{formatCurrency(results.budgetAllocated.necessities)}</span>
                    </div>
                    <Slider 
                      value={[budgetAllocations.necessities]} 
                      min={0} 
                      max={100} 
                      step={1} 
                      onValueChange={handleNecessitiesChange}
                      className="mb-4"
                    />
                  </div>
                  
                  {/* Wants */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Desideri ({budgetAllocations.wants}%)</Label>
                      <span>{formatCurrency(results.budgetAllocated.wants)}</span>
                    </div>
                    <Slider 
                      value={[budgetAllocations.wants]} 
                      min={0} 
                      max={100 - budgetAllocations.necessities} 
                      step={1} 
                      onValueChange={handleWantsChange}
                      className="mb-4"
                    />
                  </div>
                  
                  {/* Savings */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Risparmio ({budgetAllocations.savings}%)</Label>
                      <span>{formatCurrency(results.budgetAllocated.savings)}</span>
                    </div>
                    <Slider 
                      value={[budgetAllocations.savings]} 
                      min={0} 
                      max={100 - budgetAllocations.necessities - budgetAllocations.wants} 
                      step={1} 
                      onValueChange={handleSavingsChange}
                      className="mb-4"
                    />
                  </div>
                </div>
                
                {/* Budget Allocation Chart */}
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetAllocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                      >
                        {budgetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Expenses by Category Chart */}
            <Card className="md:col-span-3">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Suddivisione Spese</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value="income">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Reddito Principale</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="income-description" className="mb-2 block">Descrizione</Label>
                    <Input 
                      id="income-description"
                      value={mainIncome.description}
                      onChange={(e) => setMainIncome({...mainIncome, description: e.target.value})}
                      placeholder="Stipendio"
                    />
                  </div>

                  <div>
                    <Label htmlFor="income-amount" className="mb-2 block">Importo</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                      <Input 
                        id="income-amount"
                        type="number"
                        value={mainIncome.amount || ''}
                        onChange={(e) => setMainIncome({...mainIncome, amount: parseFloat(e.target.value) || 0})}
                        className="pl-8"
                        placeholder="2,500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="income-frequency" className="mb-2 block">Frequenza</Label>
                    <Select 
                      value={mainIncome.frequency} 
                      onValueChange={(value) => setMainIncome({...mainIncome, frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona frequenza" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="income-gross"
                        checked={mainIncome.isGross}
                        onChange={(e) => setMainIncome({...mainIncome, isGross: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="income-gross">Lordo (prima delle tasse)</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Entrate Aggiuntive</h3>
              <Button onClick={addIncome} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Entrata
              </Button>
            </div>
            
            {additionalIncomes.length > 0 ? (
              <div className="space-y-4">
                {additionalIncomes.map((income) => (
                  <Card key={income.id}>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor={`income-${income.id}-desc`} className="mb-2 block">Descrizione</Label>
                          <Input 
                            id={`income-${income.id}-desc`}
                            value={income.description}
                            onChange={(e) => updateIncome(income.id, 'description', e.target.value)}
                            placeholder="Freelance"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`income-${income.id}-amount`} className="mb-2 block">Importo</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                            <Input 
                              id={`income-${income.id}-amount`}
                              type="number"
                              value={income.amount || ''}
                              onChange={(e) => updateIncome(income.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`income-${income.id}-frequency`} className="mb-2 block">Frequenza</Label>
                          <Select 
                            value={income.frequency} 
                            onValueChange={(value) => updateIncome(income.id, 'frequency', value)}
                          >
                            <SelectTrigger id={`income-${income.id}-frequency`}>
                              <SelectValue placeholder="Seleziona frequenza" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`income-${income.id}-recurring`}
                              checked={income.isRecurring}
                              onChange={(e) => updateIncome(income.id, 'isRecurring', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={`income-${income.id}-recurring`}>Ricorrente</Label>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeIncome(income.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Nessuna entrata aggiuntiva. Clicca "Aggiungi Entrata" per iniziare.
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Totale Entrate Mensili</h3>
                  <p className="text-sm text-gray-500">Tutte le entrate convertite in importo mensile</p>
                </div>
                <span className="text-2xl font-bold text-green-500">
                  {formatCurrency(results.totalMonthlyIncome)}
                </span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryExpenses = expenses.filter(e => e.category === category.id);
              const categoryTotal = results.categoryTotals[category.id] || 0;
              const budgetStatus = getCategoryBudgetStatus(category.id);
              
              return (
                <Collapsible key={category.id}>
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="mr-3" style={{ color: category.color }}>
                            {category.icon}
                          </div>
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <span className={`text-lg font-medium ${budgetStatus === 'over' ? 'text-red-500' : 'text-green-500'}`}>
                              {formatCurrency(categoryTotal)}
                            </span>
                            {categoryTotal > 0 && results.totalMonthlyExpenses > 0 && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({((categoryTotal / results.totalMonthlyExpenses) * 100).toFixed(0)}%)
                              </span>
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform collapsible-icon" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-6 pt-0 border-t">
                        {categoryExpenses.length > 0 ? (
                          <div className="space-y-4">
                            {categoryExpenses.map((expense) => (
                              <div key={expense.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 py-3 border-b last:border-b-0">
                                <div className="md:col-span-2">
                                  <Label htmlFor={`expense-${expense.id}-desc`} className="mb-1 block">Descrizione</Label>
                                  <Input 
                                    id={`expense-${expense.id}-desc`}
                                    value={expense.description}
                                    onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                                    placeholder="Descrizione spesa"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`expense-${expense.id}-amount`} className="mb-1 block">Importo</Label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                    <Input 
                                      id={`expense-${expense.id}-amount`}
                                      type="number"
                                      value={expense.amount || ''}
                                      onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                                      className="pl-8"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`expense-${expense.id}-frequency`} className="mb-1 block">Frequenza</Label>
                                  <Select 
                                    value={expense.frequency} 
                                    onValueChange={(value) => updateExpense(expense.id, 'frequency', value)}
                                  >
                                    <SelectTrigger id={`expense-${expense.id}-frequency`}>
                                      <SelectValue placeholder="Frequenza" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {frequencyOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`expense-${expense.id}-priority`} className="mb-1 block">Priorità</Label>
                                  <Select 
                                    value={expense.priority} 
                                    onValueChange={(value: 'essential' | 'important' | 'discretionary') => 
                                      updateExpense(expense.id, 'priority', value)
                                    }
                                  >
                                    <SelectTrigger id={`expense-${expense.id}-priority`}>
                                      <SelectValue placeholder="Priorità" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {priorityOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="flex items-end justify-between">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`expense-${expense.id}-fixed`}
                                      checked={expense.isFixed}
                                      onChange={(e) => updateExpense(expense.id, 'isFixed', e.target.checked)}
                                      className="rounded border-gray-300"
                                    />
                                    <Label htmlFor={`expense-${expense.id}-fixed`}>Fisso</Label>
                                  </div>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => removeExpense(expense.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            Nessuna spesa in questa categoria.
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => addExpense(category.id)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Aggiungi spesa in {category.name}
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
            
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Totale Spese Mensili</h3>
                  <p className="text-sm text-gray-500">Tutte le spese convertite in importo mensile</p>
                </div>
                <span className="text-2xl font-bold text-red-500">
                  {formatCurrency(results.totalMonthlyExpenses)}
                </span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* Budget Summary Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Riepilogo Budget</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium mb-2">Necessità</h4>
                    <div className="h-4 bg-gray-200 rounded-full mb-2">
                      <div 
                        className="h-4 bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (getCategoryExpensesByType('necessities') / results.budgetAllocated.necessities) * 100)}%`,
                          backgroundColor: getCategoryExpensesByType('necessities') > results.budgetAllocated.necessities ? '#EF4444' : '#1E88E5'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(getCategoryExpensesByType('necessities'))}</span>
                      <span>di {formatCurrency(results.budgetAllocated.necessities)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Desideri</h4>
                    <div className="h-4 bg-gray-200 rounded-full mb-2">
                      <div 
                        className="h-4 bg-purple-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (getCategoryExpensesByType('wants') / results.budgetAllocated.wants) * 100)}%`,
                          backgroundColor: getCategoryExpensesByType('wants') > results.budgetAllocated.wants ? '#EF4444' : '#8E24AA'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(getCategoryExpensesByType('wants'))}</span>
                      <span>di {formatCurrency(results.budgetAllocated.wants)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Risparmio</h4>
                    <div className="h-4 bg-gray-200 rounded-full mb-2">
                      <div 
                        className="h-4 bg-green-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (getCategoryExpensesByType('savings') / results.budgetAllocated.savings) * 100)}%`,
                          backgroundColor: getCategoryExpensesByType('savings') > results.budgetAllocated.savings ? '#EF4444' : '#43A047'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(getCategoryExpensesByType('savings'))}</span>
                      <span>di {formatCurrency(results.budgetAllocated.savings)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Provide advice based on budget status */}
                {renderBudgetAdvice()}
              </CardContent>
            </Card>
            
            {/* Expenses Breakdown Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ripartizione Spese</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={generateCategoryData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis tickFormatter={(value) => `€${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="amount" name="Importo" fill="#2196F3" />
                      <Bar dataKey="budget" name="Budget Allocato" fill="#66BB6A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Income vs Expenses Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Entrate vs Uscite</h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[{
                        name: 'Bilancio Mensile',
                        income: results.totalMonthlyIncome,
                        expenses: results.totalMonthlyExpenses,
                        balance: results.balance
                      }]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `€${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="income" name="Entrate" fill="#4CAF50" />
                      <Bar dataKey="expenses" name="Uscite" fill="#F44336" />
                      <Bar dataKey="balance" name="Bilancio" fill="#2196F3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Suggerimenti di Miglioramento</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.balance < 0 && (
                      <li className="text-red-500">
                        Il tuo bilancio è negativo. Considera di ridurre le spese non essenziali o aumentare le entrate.
                      </li>
                    )}
                    {results.savingsRate < 20 && (
                      <li className="text-amber-500">
                        Il tuo tasso di risparmio è sotto il 20% raccomandato. Prova a spostare più fondi nella categoria risparmio.
                      </li>
                    )}
                    {getCategoryExpensesByType('wants') > results.budgetAllocated.wants && (
                      <li className="text-amber-500">
                        Stai spendendo più del budget allocato per i desideri. Considera di ridurre alcune spese discrezionali.
                      </li>
                    )}
                    {results.balance > 0 && results.balance > results.totalMonthlyIncome * 0.3 && (
                      <li className="text-green-500">
                        Hai un buon surplus! Considera di aumentare i risparmi o gli investimenti per il futuro.
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Helper function to calculate expenses by budget type
  function getCategoryExpensesByType(budgetType: 'necessities' | 'wants' | 'savings'): number {
    const categoryToBudgetType: Record<string, keyof typeof results.budgetAllocated> = {
      housing: 'necessities',
      transportation: 'necessities',
      food: 'necessities',
      health: 'necessities',
      entertainment: 'wants',
      savings: 'savings',
      debts: 'necessities',
      other: 'wants'
    };
    
    return Object.entries(results.categoryTotals)
      .filter(([category]) => categoryToBudgetType[category] === budgetType)
      .reduce((total, [_, amount]) => total + amount, 0);
  }

  // Generate data for category comparison chart
  function generateCategoryData() {
    return categories.map(category => {
      const amount = results.categoryTotals[category.id] || 0;
      
      // Map category to budget type
      const categoryToBudgetType: Record<string, keyof typeof results.budgetAllocated> = {
        housing: 'necessities',
        transportation: 'necessities',
        food: 'necessities',
        health: 'necessities',
        entertainment: 'wants',
        savings: 'savings',
        debts: 'necessities',
        other: 'wants'
      };
      
      const budgetType = categoryToBudgetType[category.id];
      const totalCategoriesOfType = Object.values(categoryToBudgetType).filter(type => type === budgetType).length;
      const budget = results.budgetAllocated[budgetType] / totalCategoriesOfType;
      
      return {
        name: category.name,
        amount,
        budget
      };
    });
  }

  // Render budget advice
  function renderBudgetAdvice() {
    const necessitiesAmount = getCategoryExpensesByType('necessities');
    const wantsAmount = getCategoryExpensesByType('wants');
    const savingsAmount = getCategoryExpensesByType('savings');
    
    const necessitiesBudget = results.budgetAllocated.necessities;
    const wantsBudget = results.budgetAllocated.wants;
    const savingsBudget = results.budgetAllocated.savings;
    
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h4 className="flex items-center text-blue-800 font-medium mb-2">
          <Info className="h-4 w-4 mr-2" />
          Analisi Budget
        </h4>
        <ul className="space-y-2 text-sm text-blue-700">
          {necessitiesAmount > necessitiesBudget && (
            <li>
              Stai spendendo {formatCurrency(necessitiesAmount - necessitiesBudget)} più del previsto per le necessità.
              {" "}Cerca di rivedere le spese essenziali più elevate.
            </li>
          )}
          {wantsAmount > wantsBudget && (
            <li>
              Le spese per desideri superano il budget di {formatCurrency(wantsAmount - wantsBudget)}.
              {" "}Considera di ridurre alcune spese discrezionali.
            </li>
          )}
          {savingsAmount < savingsBudget && (
            <li>
              Stai risparmiando meno del target di {formatCurrency(savingsBudget)}.
              {" "}Prova ad aumentare i contributi al risparmio.
            </li>
          )}
          {results.balance < 0 && (
            <li className="text-red-600 font-semibold">
              Attenzione: il tuo bilancio è negativo di {formatCurrency(Math.abs(results.balance))}.
              {" "}Stai spendendo più di quanto guadagni.
            </li>
          )}
          {results.balance >= 0 && results.savingsRate >= 20 && (
            <li className="text-green-600">
              Ottimo lavoro! Hai un bilancio positivo e stai risparmiando {results.savingsRate.toFixed(1)}% del tuo reddito.
            </li>
          )}
        </ul>
      </div>
    );
  }
};

export default BudgetCalculator;
