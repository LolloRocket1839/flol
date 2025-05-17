
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
  initialCapital: z.coerce.number().min(0, { message: "Il capitale deve essere positivo" }),
  regularContribution: z.coerce.number().min(0, { message: "Il contributo deve essere positivo" }),
  interestRate: z.coerce.number().min(0, { message: "Il tasso deve essere positivo" }),
  years: z.coerce.number().int().min(1, { message: "Almeno 1 anno" }).max(50, { message: "Massimo 50 anni" }),
  contributionFrequency: z.enum(["monthly", "quarterly", "yearly"]),
  compoundingFrequency: z.enum(["monthly", "quarterly", "yearly"]),
  contributionTiming: z.enum(["beginning", "end"])
});

type FormValues = z.infer<typeof formSchema>;

const CompoundInterestAdvancedCalculator = () => {
  const [results, setResults] = useState<{
    finalAmount: number;
    interestEarned: number;
    totalContributions: number;
    yearlyData: { year: number; balance: number; contributions: number; interest: number; }[];
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialCapital: 10000,
      regularContribution: 200,
      interestRate: 6,
      years: 20,
      contributionFrequency: "monthly",
      compoundingFrequency: "monthly",
      contributionTiming: "end"
    },
  });

  const watchAll = form.watch();

  useEffect(() => {
    calculateCompoundInterest(watchAll);
  }, [watchAll]);

  const getPeriodsPerYear = (frequency: string): number => {
    switch (frequency) {
      case "monthly": return 12;
      case "quarterly": return 4;
      case "yearly": return 1;
      default: return 12;
    }
  };

  const calculateCompoundInterest = (values: FormValues) => {
    const {
      initialCapital,
      regularContribution,
      interestRate,
      years,
      contributionFrequency,
      compoundingFrequency,
      contributionTiming,
    } = values;

    const compoundingPeriodsPerYear = getPeriodsPerYear(compoundingFrequency);
    const contributionPeriodsPerYear = getPeriodsPerYear(contributionFrequency);
    const periodsInTotal = years * compoundingPeriodsPerYear;
    const r = interestRate / 100 / compoundingPeriodsPerYear;
    
    let balance = initialCapital;
    let totalContributions = initialCapital;
    const yearlyData = [];

    // Variabili di tracciamento per ogni anno
    let currentYear = 1;
    let yearStartBalance = initialCapital;
    let yearContributions = 0;
    
    for (let period = 1; period <= periodsInTotal; period++) {
      // Calcola contributo per questo periodo
      const contributionThisPeriod = (period % (compoundingPeriodsPerYear / contributionPeriodsPerYear) === 0) ? 
        regularContribution : 0;
      
      // Aggiunge contributo all'inizio del periodo se richiesto
      if (contributionTiming === "beginning" && contributionThisPeriod > 0) {
        balance += contributionThisPeriod;
        totalContributions += contributionThisPeriod;
        yearContributions += contributionThisPeriod;
      }
      
      // Calcola interesse per questo periodo
      balance = balance * (1 + r);
      
      // Aggiunge contributo alla fine del periodo (default)
      if (contributionTiming === "end" && contributionThisPeriod > 0) {
        balance += contributionThisPeriod;
        totalContributions += contributionThisPeriod;
        yearContributions += contributionThisPeriod;
      }
      
      // Se abbiamo completato un anno, registra i dati per il grafico
      if (period % compoundingPeriodsPerYear === 0) {
        yearlyData.push({
          year: currentYear,
          balance: Math.round(balance * 100) / 100,
          contributions: totalContributions,
          interest: Math.round((balance - totalContributions) * 100) / 100
        });
        
        // Reset per l'anno successivo
        currentYear++;
        yearStartBalance = balance;
        yearContributions = 0;
      }
    }

    setResults({
      finalAmount: Math.round(balance * 100) / 100,
      interestEarned: Math.round((balance - totalContributions) * 100) / 100,
      totalContributions,
      yearlyData
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case "monthly": return "mensile";
      case "quarterly": return "trimestrale";
      case "yearly": return "annuale";
      default: return frequency;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calcolatore di Interesse Composto Avanzato</CardTitle>
        <CardDescription>
          Calcola come cresceranno i tuoi investimenti nel tempo con l'interesse composto
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="form">Parametri</TabsTrigger>
            <TabsTrigger value="results">Risultati</TabsTrigger>
            <TabsTrigger value="chart">Grafico</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4">
            <Form {...form}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="initialCapital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Capitale Iniziale
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <Info className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              Il capitale con cui inizi l'investimento.
                            </PopoverContent>
                          </Popover>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">€</span>
                            <Input
                              type="number"
                              className="pl-7"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regularContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Contributo Periodico
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <Info className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              L'importo che aggiungi regolarmente all'investimento.
                            </PopoverContent>
                          </Popover>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">€</span>
                            <Input
                              type="number"
                              className="pl-7"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Tasso di Interesse Annuo (%)
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                <Info className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              Il rendimento percentuale atteso annualmente.
                            </PopoverContent>
                          </Popover>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.1"
                              className="pr-7"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                            <span className="absolute right-3 top-2.5">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periodo di Investimento (anni)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>1</span>
                              <span>50</span>
                            </div>
                            <Slider
                              min={1}
                              max={50}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="py-4"
                            />
                            <div className="text-center font-medium">
                              {field.value} {field.value === 1 ? "anno" : "anni"}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contributionFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequenza dei Contributi</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona frequenza" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Mensile</SelectItem>
                            <SelectItem value="quarterly">Trimestrale</SelectItem>
                            <SelectItem value="yearly">Annuale</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="compoundingFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequenza di Capitalizzazione</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona frequenza" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Mensile</SelectItem>
                            <SelectItem value="quarterly">Trimestrale</SelectItem>
                            <SelectItem value="yearly">Annuale</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contributionTiming"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempistica dei Contributi</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona la tempistica" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginning">Inizio periodo</SelectItem>
                            <SelectItem value="end">Fine periodo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="results">
            {results && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-green-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Capitale Finale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(results.finalAmount)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Contributi Totali</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(results.totalContributions)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Interessi Guadagnati</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-purple-700">
                        {formatCurrency(results.interestEarned)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-slate-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Riepilogo dell'Investimento</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Capitale iniziale:</span>
                      <span className="font-medium">{formatCurrency(watchAll.initialCapital)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Contributo {getFrequencyLabel(watchAll.contributionFrequency)}:</span>
                      <span className="font-medium">{formatCurrency(watchAll.regularContribution)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tasso di interesse:</span>
                      <span className="font-medium">{watchAll.interestRate}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Periodo di investimento:</span>
                      <span className="font-medium">{watchAll.years} {watchAll.years === 1 ? "anno" : "anni"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Capitalizzazione:</span>
                      <span className="font-medium">{getFrequencyLabel(watchAll.compoundingFrequency)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Contributi versati a:</span>
                      <span className="font-medium">{watchAll.contributionTiming === "beginning" ? "inizio periodo" : "fine periodo"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chart">
            {results && (
              <div className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={results.yearlyData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Anno', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `€${value.toLocaleString()}`}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [`€${Number(value).toLocaleString()}`, undefined]}
                        labelFormatter={(label) => `Anno ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        name="Capitale totale"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="contributions"
                        name="Contributi"
                        stroke="#22c55e"
                        strokeDasharray="5 5"
                      />
                      <Line
                        type="monotone"
                        dataKey="interest"
                        name="Interessi"
                        stroke="#a855f7"
                        strokeDasharray="3 3"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Anno</th>
                        <th className="px-4 py-2 text-right">Capitale</th>
                        <th className="px-4 py-2 text-right">Contributi</th>
                        <th className="px-4 py-2 text-right">Interessi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.yearlyData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2">{row.year}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(row.balance)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(row.contributions)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(row.interest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompoundInterestAdvancedCalculator;
