
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FireCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [annualIncome, setAnnualIncome] = useState(40000);
  const [annualExpenses, setAnnualExpenses] = useState(30000);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState(4);
  const [results, setResults] = useState({
    targetAmount: 0,
    yearsToFire: 0,
    fireAge: 0,
    savingsRate: 0,
    progress: 0
  });

  useEffect(() => {
    // Calculate target amount based on expenses and safe withdrawal rate
    const annualSavings = annualIncome - annualExpenses;
    const targetAmount = (annualExpenses * 100) / safeWithdrawalRate;
    const savingsRate = (annualSavings / annualIncome) * 100;
    
    // Calculate years to FIRE
    let yearsToFire = 0;
    let currentTotal = currentSavings;
    
    while (currentTotal < targetAmount) {
      currentTotal = currentTotal * (1 + annualReturn / 100) + annualSavings;
      yearsToFire++;
      
      // Safety cap at 100 years to prevent infinite loops
      if (yearsToFire > 100) break;
    }
    
    const fireAge = currentAge + yearsToFire;
    const progress = Math.min((currentSavings / targetAmount) * 100, 100);
    
    setResults({
      targetAmount,
      yearsToFire,
      fireAge,
      savingsRate,
      progress
    });
  }, [currentAge, currentSavings, annualIncome, annualExpenses, annualReturn, safeWithdrawalRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      <Tabs defaultValue="inputs">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="inputs">Input</TabsTrigger>
          <TabsTrigger value="results">Risultati</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inputs">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentAge">Età attuale</Label>
              <Input
                id="currentAge"
                type="number"
                min="18"
                max="80"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentSavings">Risparmi attuali</Label>
              <Input
                id="currentSavings"
                type="number"
                min="0"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Reddito annuale</Label>
              <Input
                id="annualIncome"
                type="number"
                min="0"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualExpenses">Spese annuali</Label>
              <Input
                id="annualExpenses"
                type="number"
                min="0"
                max={annualIncome}
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="annualReturn">Rendimento annuo (%)</Label>
                <span>{annualReturn}%</span>
              </div>
              <Slider
                id="annualReturn"
                min={1}
                max={12}
                step={0.5}
                value={[annualReturn]}
                onValueChange={(value) => setAnnualReturn(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="safeWithdrawalRate">Tasso di prelievo sicuro (%)</Label>
                <span>{safeWithdrawalRate}%</span>
              </div>
              <Slider
                id="safeWithdrawalRate"
                min={2}
                max={6}
                step={0.25}
                value={[safeWithdrawalRate]}
                onValueChange={(value) => setSafeWithdrawalRate(value[0])}
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-fintool-blue text-white rounded-lg">
                <h3 className="text-lg font-medium">Risultato FIRE</h3>
                <div className="text-4xl font-bold">
                  {results.yearsToFire} anni
                </div>
                <div>
                  Età al raggiungimento: <strong>{results.fireAge} anni</strong>
                </div>
              </div>
              
              <div className="space-y-4 p-4 bg-fintool-teal text-white rounded-lg">
                <h3 className="text-lg font-medium">Obiettivo di risparmio</h3>
                <div className="text-4xl font-bold">
                  {formatCurrency(results.targetAmount)}
                </div>
                <Progress value={results.progress} className="bg-white/20 h-2" />
                <div className="text-sm">
                  {formatCurrency(currentSavings)} / {formatCurrency(results.targetAmount)} ({Math.round(results.progress)}%)
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div>
                <div className="font-medium">Tasso di risparmio</div>
                <div className="text-2xl font-bold text-fintool-blue">
                  {Math.round(results.savingsRate)}%
                </div>
                <div className="text-sm text-gray-600">
                  Stai risparmiando {formatCurrency(annualIncome - annualExpenses)} all'anno
                </div>
              </div>
              
              <div>
                <div className="font-medium">Prelievo annuo stimato</div>
                <div className="text-2xl font-bold text-fintool-teal">
                  {formatCurrency(annualExpenses)}
                </div>
                <div className="text-sm text-gray-600">
                  Basato sul tasso di prelievo sicuro del {safeWithdrawalRate}%
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Note sul Calcolatore FIRE</h3>
        <p className="text-sm text-gray-600">
          Il movimento FIRE (Financial Independence, Retire Early) si basa sul risparmio di una parte significativa 
          del proprio reddito per raggiungere l'indipendenza finanziaria prima dell'età pensionabile tradizionale. 
          Il tasso di prelievo sicuro si riferisce alla percentuale del tuo portafoglio che puoi prelevare annualmente 
          senza esaurire i tuoi risparmi nel lungo periodo.
        </p>
      </div>
    </div>
  );
};

export default FireCalculator;
