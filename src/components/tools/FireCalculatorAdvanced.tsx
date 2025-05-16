import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, DollarSign, LineChart, PieChart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

const FireCalculatorAdvanced: React.FC = () => {
  // State per i dati personali
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [targetAge, setTargetAge] = useState<number>(50);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  
  // State per la situazione finanziaria
  const [currentAssets, setCurrentAssets] = useState<number>(50000);
  const [annualIncome, setAnnualIncome] = useState<number>(40000);
  const [savingsRate, setSavingsRate] = useState<number>(25);
  const [annualExpenses, setAnnualExpenses] = useState<number>(30000);
  
  // State per le proiezioni
  const [annualReturn, setAnnualReturn] = useState<number>(6);
  const [inflation, setInflation] = useState<number>(2);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4);
  
  // State per i tabs
  const [activeTab, setActiveTab] = useState<string>("personal");
  
  // Calcolo dello step di avanzamento
  const getProgressStep = () => {
    switch(activeTab) {
      case "personal": return 1;
      case "financial": return 2;
      case "projections": return 3;
      case "results": return 4;
      default: return 1;
    }
  };

  // Format numbers with currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calcola annualSavings
  const annualSavings = annualIncome * (savingsRate / 100);

  // Calcola il patrimonio necessario per il FIRE basato sul withdrawal rate
  const requiredAssets = annualExpenses * (100 / withdrawalRate);

  // Calcolo anni al FIRE e patrimonio finale
  const calculateFireProjection = () => {
    let currentAssetsValue = currentAssets;
    let years = 0;
    const projectionData = [];
    
    while (currentAssetsValue < requiredAssets && years + currentAge < targetAge) {
      const yearData = {
        age: currentAge + years,
        assets: currentAssetsValue,
        target: requiredAssets,
      };
      
      projectionData.push(yearData);
      
      currentAssetsValue = currentAssetsValue * (1 + annualReturn / 100) + annualSavings;
      years++;
    }
    
    // Aggiungi l'ultimo anno se abbiamo raggiunto il target
    if (currentAssetsValue >= requiredAssets) {
      projectionData.push({
        age: currentAge + years,
        assets: currentAssetsValue,
        target: requiredAssets,
      });
    }
    
    return {
      years,
      finalAssets: currentAssetsValue,
      fireAge: currentAge + years,
      projectionData,
      hasReached: currentAssetsValue >= requiredAssets,
    };
  };
  
  const fireProjection = calculateFireProjection();
  
  // Estendi i dati di proiezione fino all'età target anche se il FIRE è già stato raggiunto
  const extendedProjectionData = [...fireProjection.projectionData];
  
  if (fireProjection.fireAge < targetAge) {
    let lastAssets = fireProjection.finalAssets;
    
    for (let age = fireProjection.fireAge + 1; age <= targetAge; age++) {
      lastAssets = lastAssets * (1 + (annualReturn - inflation) / 100); // Consideriamo l'inflazione nella fase post-FIRE
      
      extendedProjectionData.push({
        age,
        assets: lastAssets,
        target: requiredAssets,
      });
    }
  }

  // Formatta i dati della proiezione per il grafico area
  const chartData = extendedProjectionData.map(data => ({
    age: data.age,
    assets: Math.round(data.assets),
    target: Math.round(data.target)
  }));

  // Determina il colore in base all'età target
  const getTargetAgeColor = () => {
    if (targetAge < 50) return "text-green-600";
    if (targetAge <= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Handle next tab
  const handleNextTab = () => {
    switch(activeTab) {
      case "personal": setActiveTab("financial"); break;
      case "financial": setActiveTab("projections"); break;
      case "projections": setActiveTab("results"); break;
      default: break;
    }
  };

  // Handle prev tab
  const handlePrevTab = () => {
    switch(activeTab) {
      case "financial": setActiveTab("personal"); break;
      case "projections": setActiveTab("financial"); break;
      case "results": setActiveTab("projections"); break;
      default: break;
    }
  };

  // Memorizza i dati nell'localStorage
  useEffect(() => {
    const savedData = {
      currentAge,
      targetAge,
      lifeExpectancy,
      currentAssets,
      annualIncome,
      savingsRate,
      annualExpenses,
      annualReturn,
      inflation,
      withdrawalRate
    };
    
    localStorage.setItem('fireCalculatorData', JSON.stringify(savedData));
  }, [
    currentAge, targetAge, lifeExpectancy, 
    currentAssets, annualIncome, savingsRate, annualExpenses,
    annualReturn, inflation, withdrawalRate
  ]);
  
  // Carica i dati dall'localStorage all'avvio
  useEffect(() => {
    const savedDataString = localStorage.getItem('fireCalculatorData');
    if (savedDataString) {
      try {
        const savedData = JSON.parse(savedDataString);
        setCurrentAge(savedData.currentAge);
        setTargetAge(savedData.targetAge);
        setLifeExpectancy(savedData.lifeExpectancy);
        setCurrentAssets(savedData.currentAssets);
        setAnnualIncome(savedData.annualIncome);
        setSavingsRate(savedData.savingsRate);
        setAnnualExpenses(savedData.annualExpenses);
        setAnnualReturn(savedData.annualReturn);
        setInflation(savedData.inflation);
        setWithdrawalRate(savedData.withdrawalRate);
      } catch (error) {
        console.error("Errore nel caricamento dei dati salvati:", error);
      }
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
          <div 
            className="bg-fintool-teal h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getProgressStep() / 4) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 flex justify-between">
          <span>Dati personali</span>
          <span>Situazione finanziaria</span>
          <span>Proiezioni</span>
          <span>Risultati</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="personal">Dati personali</TabsTrigger>
          <TabsTrigger value="financial">Situazione finanziaria</TabsTrigger>
          <TabsTrigger value="projections">Proiezioni</TabsTrigger>
          <TabsTrigger value="results">Risultati</TabsTrigger>
        </TabsList>

        {/* Tab 1: Dati personali */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="current-age" className="flex justify-between">
                    <span>Età attuale</span>
                    <span className="font-bold">{currentAge} anni</span>
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input 
                      id="current-age"
                      type="number" 
                      min={18} 
                      max={80} 
                      value={currentAge} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 18 && value <= 80) {
                          setCurrentAge(value);
                          if (value >= targetAge) {
                            setTargetAge(value + 1);
                          }
                        }
                      }}
                      className="w-full"
                      placeholder="30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="target-age" className="flex justify-between">
                    <span>Età target FIRE</span>
                    <span className={`font-bold ${getTargetAgeColor()}`}>{targetAge} anni</span>
                  </Label>
                  <div className="mt-2">
                    <Slider
                      id="target-age"
                      min={currentAge + 1}
                      max={80}
                      step={1}
                      value={[targetAge]}
                      onValueChange={(values) => setTargetAge(Number(values[0]))}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Ottimo</span>
                      <span>Buono</span>
                      <span>Ritardato</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="life-expectancy" className="flex justify-between">
                    <span>Aspettativa di vita</span>
                    <span className="font-bold">{lifeExpectancy} anni</span>
                  </Label>
                  <div className="mt-2">
                    <select
                      id="life-expectancy"
                      value={lifeExpectancy}
                      onChange={(e) => setLifeExpectancy(parseInt(e.target.value))}
                      className="w-full border rounded-md border-input p-2 bg-background"
                    >
                      {Array.from({ length: 21 }, (_, i) => 80 + i).map((age) => (
                        <option key={age} value={age}>{age} anni</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleNextTab}>Avanti</Button>
          </div>
        </TabsContent>
        
        {/* Tab 2: Situazione finanziaria */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="current-assets" className="flex justify-between">
                    <span>Patrimonio attuale</span>
                    <span className="font-bold">{formatCurrency(currentAssets)}</span>
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input 
                      id="current-assets"
                      type="text" 
                      value={currentAssets.toLocaleString('it-IT')} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^\d]/g, ''));
                        if (!isNaN(value)) {
                          setCurrentAssets(value);
                        }
                      }}
                      className="pl-8"
                      placeholder="50,000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="annual-income" className="flex justify-between">
                    <span>Reddito annuale</span>
                    <span className="font-bold">{formatCurrency(annualIncome)}</span>
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input 
                      id="annual-income"
                      type="text" 
                      value={annualIncome.toLocaleString('it-IT')} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^\d]/g, ''));
                        if (!isNaN(value)) {
                          setAnnualIncome(value);
                          setAnnualExpenses(value * (1 - savingsRate / 100));
                        }
                      }}
                      className="pl-8"
                      placeholder="40,000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="savings-rate" className="flex justify-between">
                    <span>Tasso di risparmio</span>
                    <span className="font-bold">{savingsRate}% ({formatCurrency(annualSavings)}/anno)</span>
                  </Label>
                  <div className="mt-2">
                    <Slider
                      id="savings-rate"
                      min={0}
                      max={90}
                      step={1}
                      value={[savingsRate]}
                      onValueChange={(values) => {
                        setSavingsRate(Number(values[0]));
                        setAnnualExpenses(annualIncome * (1 - Number(values[0]) / 100));
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>45%</span>
                      <span>90%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="annual-expenses" className="flex justify-between">
                    <span>Spese annuali</span>
                    <span className="font-bold">{formatCurrency(annualExpenses)}</span>
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input 
                      id="annual-expenses"
                      type="text" 
                      value={annualExpenses.toLocaleString('it-IT')} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^\d]/g, ''));
                        if (!isNaN(value) && value < annualIncome) {
                          setAnnualExpenses(value);
                          setSavingsRate(Math.round(((annualIncome - value) / annualIncome) * 100));
                        }
                      }}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevTab}>Indietro</Button>
            <Button onClick={handleNextTab}>Avanti</Button>
          </div>
        </TabsContent>
        
        {/* Tab 3: Proiezioni */}
        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="annual-return" className="flex justify-between">
                    <span>Rendimento medio annuo</span>
                    <span className="font-bold">{annualReturn}%</span>
                  </Label>
                  <div className="mt-2">
                    <Slider
                      id="annual-return"
                      min={1}
                      max={12}
                      step={0.1}
                      value={[annualReturn]}
                      onValueChange={(values) => setAnnualReturn(Number(values[0]))}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1%</span>
                      <span>6%</span>
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setAnnualReturn(4)}
                    >
                      Conservativo (4%)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setAnnualReturn(6)}
                    >
                      Moderato (6%)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setAnnualReturn(8)}
                    >
                      Aggressivo (8%)
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="inflation" className="flex justify-between">
                    <span>Inflazione prevista</span>
                    <span className="font-bold">{inflation}%</span>
                  </Label>
                  <div className="relative mt-2">
                    <Input 
                      id="inflation"
                      type="number" 
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={inflation} 
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0.1 && value <= 10) {
                          setInflation(value);
                        }
                      }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Media storica italiana: ~2% (ultimi 20 anni)
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="withdrawal-rate" className="flex justify-between">
                    <span>Safe Withdrawal Rate (SWR)</span>
                    <span className={`font-bold ${withdrawalRate >= 3 && withdrawalRate <= 4 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {withdrawalRate}%
                    </span>
                  </Label>
                  <div className="mt-2">
                    <Slider
                      id="withdrawal-rate"
                      min={2}
                      max={5}
                      step={0.1}
                      value={[withdrawalRate]}
                      onValueChange={(values) => setWithdrawalRate(Number(values[0]))}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>2%</span>
                      <span>3.5%</span>
                      <span>5%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Info className="w-4 h-4 inline mr-1" />
                      <span>
                        Range sicuro: 3-4%. Valori più alti aumentano il rischio di esaurire i fondi.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevTab}>Indietro</Button>
            <Button onClick={handleNextTab}>Vedi risultati</Button>
          </div>
        </TabsContent>
        
        {/* Tab 4: Risultati */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={`border-l-4 ${fireProjection.hasReached ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-1 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Raggiungerai il FIRE
                </h3>
                <p className="text-3xl font-bold">
                  {fireProjection.hasReached 
                    ? `a ${fireProjection.fireAge} anni (${fireProjection.years} anni)`
                    : `non raggiunto entro l'età target`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-fintool-blue">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-1 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Capitale target necessario
                </h3>
                <p className="text-3xl font-bold">{formatCurrency(requiredAssets)}</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-fintool-teal">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-1 flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Patrimonio stimato al FIRE
                </h3>
                <p className="text-3xl font-bold">{formatCurrency(fireProjection.finalAssets)}</p>
              </CardContent>
            </Card>
            
            <Card className={`border-l-4 ${fireProjection.finalAssets >= requiredAssets ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-1 flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Surplus/Deficit
                </h3>
                <p className={`text-3xl font-bold ${fireProjection.finalAssets >= requiredAssets ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(fireProjection.finalAssets - requiredAssets)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Proiezione patrimonio</h3>
              <div className="h-[300px]">
                <ChartContainer 
                  config={{
                    assets: {
                      label: "Patrimonio",
                      color: "#0d9488" // fintool-teal
                    },
                    target: {
                      label: "Target FIRE",
                      color: "#1a365d" // fintool-blue
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="age"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value} anni`}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-4 border rounded-lg shadow-lg">
                                <p className="font-semibold">{`Età: ${payload[0].payload.age} anni`}</p>
                                <p className="text-fintool-teal">{`Patrimonio: ${formatCurrency(payload[0].value)}`}</p>
                                <p className="text-fintool-blue">{`Target FIRE: ${formatCurrency(payload[0].payload.target)}`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <ReferenceLine
                        y={requiredAssets}
                        stroke="#1a365d"
                        strokeDasharray="3 3"
                        label={{
                          value: "Target FIRE",
                          position: "insideTopRight",
                          fill: "#1a365d",
                          fontSize: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="assets"
                        stroke="#0d9488"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAssets)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Cosa significa questo risultato?</strong> Con un tasso di risparmio del {savingsRate}%
              e un rendimento annuo del {annualReturn}%, il tuo patrimonio crescerà fino a {formatCurrency(fireProjection.finalAssets)}
              {fireProjection.hasReached 
                ? `, permettendoti di raggiungere l'indipendenza finanziaria a ${fireProjection.fireAge} anni.` 
                : `, che non è sufficiente per raggiungere l'indipendenza finanziaria entro l'età target di ${targetAge} anni.`
              }
            </p>
            
            <p className="text-sm text-gray-600">
              <strong>Azioni consigliate:</strong>
              {fireProjection.hasReached
                ? " Continua con la tua strategia attuale. Considera di aumentare il tasso di risparmio per accelerare il percorso verso il FIRE."
                : " Aumenta il tasso di risparmio, cerca di incrementare il reddito o riduci le spese annuali per raggiungere il tuo obiettivo FIRE."
              }
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevTab}>Modifica proiezioni</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FireCalculatorAdvanced;
