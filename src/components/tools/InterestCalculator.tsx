
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InterestCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [years, setYears] = useState(20);
  const [chartData, setChartData] = useState<{ year: number; amount: number }[]>([]);

  useEffect(() => {
    const calculateCompoundInterest = () => {
      const data = [];
      let balance = initialInvestment;
      const monthlyRate = annualReturn / 100 / 12;
      
      for (let year = 0; year <= years; year++) {
        data.push({
          year,
          amount: Math.round(balance)
        });

        if (year < years) {
          for (let month = 0; month < 12; month++) {
            balance = balance * (1 + monthlyRate) + monthlyContribution;
          }
        }
      }
      
      return data;
    };

    setChartData(calculateCompoundInterest());
  }, [initialInvestment, monthlyContribution, annualReturn, years]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const totalContributions = initialInvestment + (monthlyContribution * 12 * years);
  const finalAmount = chartData.length > 0 ? chartData[chartData.length - 1].amount : 0;
  const interestEarned = finalAmount - totalContributions;

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="initialInvestment">Investimento iniziale</Label>
            <Input
              id="initialInvestment"
              type="number"
              min="0"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Contributo mensile</Label>
            <Input
              id="monthlyContribution"
              type="number"
              min="0"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
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
              max={15}
              step={0.5}
              value={[annualReturn]}
              onValueChange={(value) => setAnnualReturn(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="years">Periodo (anni)</Label>
              <span>{years} anni</span>
            </div>
            <Slider
              id="years"
              min={1}
              max={40}
              step={1}
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Contributo totale:</span>
              <span className="font-medium">{formatCurrency(totalContributions)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interessi guadagnati:</span>
              <span className="font-medium text-fintool-teal">{formatCurrency(interestEarned)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t">
              <span>Valore finale:</span>
              <span className="font-bold">{formatCurrency(finalAmount)}</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Anni', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tickFormatter={(value) => `€${value.toLocaleString('it-IT')}`}
                width={80}
              />
              <Tooltip 
                formatter={(value) => [`€${Number(value).toLocaleString('it-IT')}`, 'Valore']}
                labelFormatter={(label) => `Anno ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                name="Valore" 
                stroke="#0d9488" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default InterestCalculator;
