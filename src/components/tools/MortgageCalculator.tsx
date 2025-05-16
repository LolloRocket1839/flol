
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MortgageData {
  importoMutuo: number;
  prezzoImmobile: number;
  tassoInteresse: number;
  durataAnni: number;
  tipoAmmortamento: 'francese' | 'italiano' | 'bullet';
  frequenzaRate: 'mensile' | 'trimestrale' | 'semestrale' | 'annuale';
}

interface AmortizationEntry {
  numero: number;
  rata: number;
  quotaCapitale: number;
  quotaInteressi: number;
  capitaleResiduo: number;
  data?: string;
}

interface MortgageResult {
  rata: number;
  numeroRate: number;
  totaleInteressi: number;
  totalePagato: number;
  pianoAmmortamento: AmortizationEntry[];
  rapportoInteressiCapitale: number;
  ltvRatio?: number;
}

const COLORS = ['#0088FE', '#FF8042'];

const MortgageCalculator = () => {
  const [activeTab, setActiveTab] = useState('base');

  // Stato base
  const [data, setData] = useState<MortgageData>({
    importoMutuo: 200000,
    prezzoImmobile: 250000,
    tassoInteresse: 3.5,
    durataAnni: 25,
    tipoAmmortamento: 'francese',
    frequenzaRate: 'mensile'
  });

  // Stato risultati
  const [results, setResults] = useState<MortgageResult | null>(null);

  // Stato paginazione tabella ammortamento
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calcola mutuo al caricamento o quando cambiano i dati
  useEffect(() => {
    const result = calcolaMutuo(data);
    setResults(result);
  }, [data]);

  // Gestisce i cambiamenti nei campi di input
  const handleInputChange = (field: keyof MortgageData, value: any) => {
    setData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Funzione per calcolare il mutuo
  const calcolaMutuo = (dati: MortgageData): MortgageResult => {
    const {
      importoMutuo,
      prezzoImmobile,
      tassoInteresse,
      durataAnni,
      tipoAmmortamento,
      frequenzaRate
    } = dati;
    
    // Calcolo numero rate totali
    const periodiPerAnno = getPeriodiPerAnno(frequenzaRate);
    const numeroRate = durataAnni * periodiPerAnno;
    
    // Calcolo tasso periodico
    const tassoPeriodico = tassoInteresse / 100 / periodiPerAnno;
    
    // Calcolo rata in base al tipo di ammortamento
    let rata = 0;
    let pianoAmmortamento: AmortizationEntry[] = [];
    
    switch (tipoAmmortamento) {
      case 'francese':
        // Formula rata costante (ammortamento francese)
        rata = importoMutuo * (tassoPeriodico * Math.pow(1 + tassoPeriodico, numeroRate)) / 
               (Math.pow(1 + tassoPeriodico, numeroRate) - 1);
        
        // Genera piano ammortamento francese
        pianoAmmortamento = generaPianoFrancese(importoMutuo, tassoPeriodico, numeroRate, rata);
        break;
        
      case 'italiano':
        // Ammortamento italiano (quota capitale costante)
        const quotaCapitale = importoMutuo / numeroRate;
        pianoAmmortamento = generaPianoItaliano(importoMutuo, tassoPeriodico, numeroRate, quotaCapitale);
        rata = pianoAmmortamento[0].rata; // Prima rata
        break;
        
      case 'bullet':
        // Ammortamento bullet (solo interessi con capitale alla fine)
        rata = importoMutuo * tassoPeriodico;
        pianoAmmortamento = generaPianoBullet(importoMutuo, tassoPeriodico, numeroRate, rata);
        break;
    }
    
    // Calcolo totali
    const totaleInteressi = pianoAmmortamento.reduce((sum, rate) => sum + rate.quotaInteressi, 0);
    const totalePagato = importoMutuo + totaleInteressi;
    const ltvRatio = prezzoImmobile > 0 ? (importoMutuo / prezzoImmobile) * 100 : undefined;
    
    return {
      rata,
      numeroRate,
      totaleInteressi,
      totalePagato,
      pianoAmmortamento,
      rapportoInteressiCapitale: totaleInteressi / importoMutuo,
      ltvRatio
    };
  };

  // Genera piano ammortamento francese (rata costante)
  const generaPianoFrancese = (importoMutuo: number, tassoPeriodico: number, numeroRate: number, rata: number): AmortizationEntry[] => {
    const piano: AmortizationEntry[] = [];
    let capitaleResiduo = importoMutuo;
    
    for (let i = 1; i <= numeroRate; i++) {
      const quotaInteressi = capitaleResiduo * tassoPeriodico;
      const quotaCapitale = rata - quotaInteressi;
      capitaleResiduo -= quotaCapitale;
      
      piano.push({
        numero: i,
        rata: rata,
        quotaCapitale: quotaCapitale,
        quotaInteressi: quotaInteressi,
        capitaleResiduo: capitaleResiduo > 0 ? capitaleResiduo : 0
      });
    }
    
    return piano;
  };

  // Genera piano ammortamento italiano (quota capitale costante)
  const generaPianoItaliano = (importoMutuo: number, tassoPeriodico: number, numeroRate: number, quotaCapitale: number): AmortizationEntry[] => {
    const piano: AmortizationEntry[] = [];
    let capitaleResiduo = importoMutuo;
    
    for (let i = 1; i <= numeroRate; i++) {
      const quotaInteressi = capitaleResiduo * tassoPeriodico;
      const rata = quotaCapitale + quotaInteressi;
      capitaleResiduo -= quotaCapitale;
      
      piano.push({
        numero: i,
        rata: rata,
        quotaCapitale: quotaCapitale,
        quotaInteressi: quotaInteressi,
        capitaleResiduo: capitaleResiduo > 0 ? capitaleResiduo : 0
      });
    }
    
    return piano;
  };

  // Genera piano ammortamento bullet (solo interessi)
  const generaPianoBullet = (importoMutuo: number, tassoPeriodico: number, numeroRate: number, rata: number): AmortizationEntry[] => {
    const piano: AmortizationEntry[] = [];
    let capitaleResiduo = importoMutuo;
    
    for (let i = 1; i <= numeroRate; i++) {
      const quotaInteressi = capitaleResiduo * tassoPeriodico;
      let quotaCapitale = 0;
      
      // Nell'ultima rata, rimborsa tutto il capitale
      if (i === numeroRate) {
        quotaCapitale = capitaleResiduo;
        capitaleResiduo = 0;
      }
      
      piano.push({
        numero: i,
        rata: i === numeroRate ? rata + capitaleResiduo : rata,
        quotaCapitale: quotaCapitale,
        quotaInteressi: quotaInteressi,
        capitaleResiduo: capitaleResiduo
      });
    }
    
    return piano;
  };

  // Ottieni numero periodi per anno in base alla frequenza
  const getPeriodiPerAnno = (frequenza: string): number => {
    switch (frequenza) {
      case 'mensile': return 12;
      case 'trimestrale': return 4;
      case 'semestrale': return 2;
      case 'annuale': return 1;
      default: return 12;
    }
  };

  // Formatta importo in euro
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Formatta percentuale
  const formatPercent = (value: number): string => {
    return new Intl.NumberFormat('it-IT', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);
  };

  // Genera label per frequenza rata
  const getRataLabel = (): string => {
    switch (data.frequenzaRate) {
      case 'mensile': return '/mese';
      case 'trimestrale': return '/trimestre';
      case 'semestrale': return '/semestre';
      case 'annuale': return '/anno';
      default: return '';
    }
  };

  // Calcola anno di fine mutuo
  const getAnnoFineMutuo = (): number => {
    return new Date().getFullYear() + data.durataAnni;
  };

  // Ottieni il valore LTV e la relativa categoria di rischio
  const getLtvCategory = (): {label: string; color: string} => {
    if (!results?.ltvRatio) return { label: 'N/A', color: 'bg-gray-400' };
    
    if (results.ltvRatio <= 50) return { label: 'Basso', color: 'bg-green-500' };
    if (results.ltvRatio <= 80) return { label: 'Medio', color: 'bg-yellow-500' };
    return { label: 'Alto', color: 'bg-red-500' };
  };

  // Genera dati per il grafico ammortamento
  const generateChartData = () => {
    if (!results) return [];
    
    // Raggruppa i dati per anno se ci sono molte rate
    const periodiPerAnno = getPeriodiPerAnno(data.frequenzaRate);
    if (periodiPerAnno === 1) {
      // Se la frequenza è annuale, usa i dati direttamente
      return results.pianoAmmortamento.map(entry => ({
        periodo: entry.numero,
        capitaleResiduo: entry.capitaleResiduo,
        quotaCapitale: entry.quotaCapitale,
        quotaInteressi: entry.quotaInteressi
      }));
    }
    
    // Altrimenti raggruppa per anno
    const annualData: any[] = [];
    
    for (let year = 0; year <= data.durataAnni; year++) {
      const periodoIdx = year * periodiPerAnno;
      if (periodoIdx < results.pianoAmmortamento.length) {
        annualData.push({
          periodo: year,
          capitaleResiduo: results.pianoAmmortamento[periodoIdx].capitaleResiduo,
          quotaCapitale: results.pianoAmmortamento.slice(periodoIdx, periodoIdx + periodiPerAnno)
            .reduce((sum, entry) => sum + entry.quotaCapitale, 0),
          quotaInteressi: results.pianoAmmortamento.slice(periodoIdx, periodoIdx + periodiPerAnno)
            .reduce((sum, entry) => sum + entry.quotaInteressi, 0)
        });
      }
    }
    
    return annualData;
  };

  // Genera dati per il grafico a torta
  const generatePieData = () => {
    if (!results) return [];
    return [
      { name: 'Capitale', value: data.importoMutuo },
      { name: 'Interessi', value: results.totaleInteressi }
    ];
  };

  // Gestisce la paginazione
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Ottieni le rate da visualizzare nella pagina corrente
  const getPaginatedAmortizationData = () => {
    if (!results) return [];
    
    const startIdx = (currentPage - 1) * rowsPerPage;
    return results.pianoAmmortamento.slice(startIdx, startIdx + rowsPerPage);
  };

  // Calcola il numero totale di pagine
  const getTotalPages = () => {
    if (!results) return 1;
    return Math.ceil(results.pianoAmmortamento.length / rowsPerPage);
  };

  // Genera array per i pulsanti di paginazione
  const getPaginationArray = () => {
    const totalPages = getTotalPages();
    const pages = [];
    
    // Aggiungi prima pagina
    pages.push(1);
    
    // Aggiungi pagine centrali
    if (currentPage > 3) pages.push('...');
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Aggiungi ultima pagina
    if (currentPage < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="mortgage-calculator">
      <Tabs defaultValue="base" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-8">
          <TabsTrigger value="base" className="flex-1">Base</TabsTrigger>
          <TabsTrigger value="avanzato" className="flex-1">Avanzato</TabsTrigger>
          <TabsTrigger value="ammortamento" className="flex-1">Ammortamento</TabsTrigger>
          <TabsTrigger value="confronto" className="flex-1">Confronto</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonna sinistra: Input */}
          <div>
            <TabsContent value="base">
              <Card>
                <CardHeader>
                  <CardTitle>Dettagli Mutuo</CardTitle>
                  <CardDescription>Inserisci i dati base del tuo mutuo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Importo mutuo */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="importoMutuo">Importo del mutuo</Label>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(data.importoMutuo)}
                      </span>
                    </div>
                    <Input
                      type="number"
                      id="importoMutuo"
                      value={data.importoMutuo}
                      onChange={(e) => handleInputChange('importoMutuo', Number(e.target.value))}
                      placeholder="200,000"
                    />
                    <Slider
                      value={[data.importoMutuo]}
                      min={10000}
                      max={1000000}
                      step={5000}
                      onValueChange={(values) => handleInputChange('importoMutuo', values[0])}
                    />
                  </div>

                  {/* Prezzo immobile */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="prezzoImmobile">Prezzo immobile (opzionale)</Label>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(data.prezzoImmobile)}
                      </span>
                    </div>
                    <Input
                      type="number"
                      id="prezzoImmobile"
                      value={data.prezzoImmobile}
                      onChange={(e) => handleInputChange('prezzoImmobile', Number(e.target.value))}
                      placeholder="250,000"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Acconto: {formatCurrency(Math.max(0, data.prezzoImmobile - data.importoMutuo))}</span>
                      <span>
                        LTV: {results?.ltvRatio ? results.ltvRatio.toFixed(1) + '%' : 'N/A'}
                        {results?.ltvRatio &&
                          <Badge 
                            variant={results.ltvRatio > 80 ? 'destructive' : 'default'}
                            className="ml-2"
                          >
                            {getLtvCategory().label}
                          </Badge>
                        }
                      </span>
                    </div>
                  </div>

                  {/* Tasso di interesse */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="tassoInteresse">Tasso di interesse annuo</Label>
                      <span className="text-sm text-gray-500">{data.tassoInteresse.toFixed(2)}%</span>
                    </div>
                    <Input
                      type="number"
                      id="tassoInteresse"
                      value={data.tassoInteresse}
                      onChange={(e) => handleInputChange('tassoInteresse', Number(e.target.value))}
                      placeholder="3.5"
                      step="0.125"
                      min="0.001"
                      max="15"
                    />
                    <Slider
                      value={[data.tassoInteresse]}
                      min={0.1}
                      max={10}
                      step={0.125}
                      onValueChange={(values) => handleInputChange('tassoInteresse', values[0])}
                    />
                  </div>

                  {/* Durata del mutuo */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="durataAnni">Durata (anni)</Label>
                      <span className="text-sm text-gray-500">
                        {data.durataAnni} anni (fino al {getAnnoFineMutuo()})
                      </span>
                    </div>
                    <Input
                      type="number"
                      id="durataAnni"
                      value={data.durataAnni}
                      onChange={(e) => handleInputChange('durataAnni', Number(e.target.value))}
                      min={1}
                      max={40}
                      step={1}
                    />
                    <Slider
                      value={[data.durataAnni]}
                      min={5}
                      max={40}
                      step={1}
                      onValueChange={(values) => handleInputChange('durataAnni', values[0])}
                    />
                  </div>

                  {/* Tipo di mutuo */}
                  <div className="space-y-2">
                    <Label>Tipo di ammortamento</Label>
                    <RadioGroup
                      value={data.tipoAmmortamento}
                      onValueChange={(value) => handleInputChange('tipoAmmortamento', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="francese" id="francese" />
                        <Label htmlFor="francese">Francese (rata costante)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="italiano" id="italiano" />
                        <Label htmlFor="italiano">Italiano (quota capitale costante)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bullet" id="bullet" />
                        <Label htmlFor="bullet">Bullet (solo interessi)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Frequenza di pagamento */}
                  <div className="space-y-2">
                    <Label htmlFor="frequenzaRate">Frequenza di pagamento</Label>
                    <Select
                      value={data.frequenzaRate}
                      onValueChange={(value) => handleInputChange('frequenzaRate', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona frequenza" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="mensile">Mensile</SelectItem>
                          <SelectItem value="trimestrale">Trimestrale</SelectItem>
                          <SelectItem value="semestrale">Semestrale</SelectItem>
                          <SelectItem value="annuale">Annuale</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="avanzato">
              <Card>
                <CardHeader>
                  <CardTitle>Opzioni avanzate</CardTitle>
                  <CardDescription>Personalizza ulteriormente il tuo mutuo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">Funzionalità avanzate in arrivo nelle prossime versioni:</p>
                    <ul className="space-y-2">
                      <li>• Spese accessorie e calcolo TAEG</li>
                      <li>• Detrazioni fiscali</li>
                      <li>• Estinzione anticipata</li>
                      <li>• Variazione tassi</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ammortamento" className="hidden md:block">
              {/* Su desktop mostriamo solo il grafico nella colonna sinistra */}
              <Card>
                <CardHeader>
                  <CardTitle>Evoluzione capitale residuo</CardTitle>
                  <CardDescription>Visualizza l'andamento del tuo debito nel tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={generateChartData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCapitale" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0056b3" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0056b3" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="periodo" 
                          label={{ 
                            value: 'Anno', 
                            position: 'insideBottomRight', 
                            offset: -10 
                          }} 
                        />
                        <YAxis 
                          tickFormatter={(value) => `€${value.toLocaleString()}`} 
                          label={{ 
                            value: 'Capitale residuo', 
                            angle: -90, 
                            position: 'insideLeft' 
                          }} 
                        />
                        <Tooltip 
                          formatter={(value) => [`€${Number(value).toLocaleString()}`, 'Capitale residuo']} 
                          labelFormatter={(value) => `Anno ${value}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="capitaleResiduo" 
                          stroke="#0056b3" 
                          fillOpacity={1} 
                          fill="url(#colorCapitale)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="confronto">
              <Card>
                <CardHeader>
                  <CardTitle>Confronta metodi di ammortamento</CardTitle>
                  <CardDescription>Analizza la differenza tra i vari tipi di piano</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { 
                            name: 'Francese', 
                            capitale: data.importoMutuo, 
                            interessi: data.importoMutuo * (Math.pow(1 + (data.tassoInteresse / 100), data.durataAnni) - 1)
                          },
                          { 
                            name: 'Italiano', 
                            capitale: data.importoMutuo,
                            interessi: data.importoMutuo * (data.tassoInteresse / 100) * (data.durataAnni + 1) / 2
                          },
                          { 
                            name: 'Bullet', 
                            capitale: data.importoMutuo,
                            interessi: data.importoMutuo * (data.tassoInteresse / 100) * data.durataAnni
                          }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `€${(value / 1000).toLocaleString()}k`} />
                        <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}`, '']} />
                        <Legend />
                        <Bar dataKey="capitale" stackId="a" name="Capitale" fill="#0056b3" />
                        <Bar dataKey="interessi" stackId="a" name="Interessi" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Prima rata</TableHead>
                          <TableHead>Ultima rata</TableHead>
                          <TableHead>Totale interessi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Francese</TableCell>
                          <TableCell>
                            {formatCurrency(data.importoMutuo * (data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate) * Math.pow(1 + data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate), data.durataAnni * getPeriodiPerAnno(data.frequenzaRate))) / (Math.pow(1 + data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate), data.durataAnni * getPeriodiPerAnno(data.frequenzaRate)) - 1))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(data.importoMutuo * (data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate) * Math.pow(1 + data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate), data.durataAnni * getPeriodiPerAnno(data.frequenzaRate))) / (Math.pow(1 + data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate), data.durataAnni * getPeriodiPerAnno(data.frequenzaRate)) - 1))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(data.importoMutuo * (Math.pow(1 + (data.tassoInteresse / 100), data.durataAnni) - 1))}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Italiano</TableCell>
                          <TableCell>
                            {formatCurrency((data.importoMutuo / (data.durataAnni * getPeriodiPerAnno(data.frequenzaRate))) + (data.importoMutuo * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate)))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency((data.importoMutuo / (data.durataAnni * getPeriodiPerAnno(data.frequenzaRate))) + (data.importoMutuo / (data.durataAnni * getPeriodiPerAnno(data.frequenzaRate)) * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate)))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(data.importoMutuo * (data.tassoInteresse / 100) * (data.durataAnni + 1) / 2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Bullet</TableCell>
                          <TableCell>
                            {formatCurrency(data.importoMutuo * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(data.importoMutuo + (data.importoMutuo * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate)))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(data.importoMutuo * (data.tassoInteresse / 100) * data.durataAnni)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    * Il confronto è indicativo e basato su formule semplificate.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>

          {/* Colonna destra: Risultati */}
          <div>
            <TabsContent value="base" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Risultati</CardTitle>
                  <CardDescription>Ecco i dettagli del tuo mutuo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rata periodica */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Rata periodica</div>
                    <div className="text-3xl font-bold text-[#0056b3] my-2">
                      {results ? formatCurrency(results.rata) : '€0'}
                      <span className="text-sm font-normal ml-1">{getRataLabel()}</span>
                    </div>
                    {data.tipoAmmortamento === 'italiano' && (
                      <Badge className="bg-[#0056b3]">Prima rata</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-sm text-gray-500">Totale da rimborsare</div>
                      <div className="text-xl font-semibold mt-1">
                        {results ? formatCurrency(results.totalePagato) : '€0'}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-sm text-gray-500">Totale interessi</div>
                      <div className="text-xl font-semibold mt-1">
                        {results ? formatCurrency(results.totaleInteressi) : '€0'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        +{results ? (results.rapportoInteressiCapitale * 100).toFixed(1) : '0'}%
                      </div>
                    </div>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={generatePieData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {generatePieData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))} 
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dettaglio</TableHead>
                          <TableHead className="text-right">Valore</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Importo mutuo</TableCell>
                          <TableCell className="text-right">{formatCurrency(data.importoMutuo)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Tasso interesse</TableCell>
                          <TableCell className="text-right">{data.tassoInteresse.toFixed(2)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Durata</TableCell>
                          <TableCell className="text-right">{data.durataAnni} anni ({results?.numeroRate} rate)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Scadenza</TableCell>
                          <TableCell className="text-right">{getAnnoFineMutuo()}</TableCell>
                        </TableRow>
                        {results?.ltvRatio && (
                          <TableRow>
                            <TableCell>LTV</TableCell>
                            <TableCell className="text-right">
                              {results.ltvRatio.toFixed(1)}%
                              <Badge 
                                variant={results.ltvRatio > 80 ? 'destructive' : 'default'}
                                className="ml-2"
                              >
                                {getLtvCategory().label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="avanzato" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Analisi avanzata</CardTitle>
                  <CardDescription>Analisi dettagliata del tuo mutuo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <p>Analisi avanzate in arrivo nelle prossime versioni.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ammortamento" className="mt-0 md:mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Piano di ammortamento</CardTitle>
                  <CardDescription>Visualizza il dettaglio delle rate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rata</TableHead>
                          <TableHead className="text-right">Importo</TableHead>
                          <TableHead className="text-right">Quota capitale</TableHead>
                          <TableHead className="text-right">Quota interessi</TableHead>
                          <TableHead className="text-right">Residuo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPaginatedAmortizationData().map((entry) => (
                          <TableRow key={entry.numero}>
                            <TableCell>{entry.numero}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.rata)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.quotaCapitale)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.quotaInteressi)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.capitaleResiduo)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginazione */}
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Precedente
                    </Button>
                    
                    {getPaginationArray().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2">...</span>
                      ) : (
                        <Button
                          key={`page-${page}`}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(Number(page))}
                        >
                          {page}
                        </Button>
                      )
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(Math.min(getTotalPages(), currentPage + 1))}
                      disabled={currentPage === getTotalPages()}
                    >
                      Successivo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Composizione rata nel tempo (visibile solo su desktop) */}
              <div className="hidden md:block mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Composizione rata nel tempo</CardTitle>
                    <CardDescription>Evoluzione quota capitale e interessi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={generateChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="periodo" />
                          <YAxis tickFormatter={(value) => `€${value.toLocaleString()}`} />
                          <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}`, '']} />
                          <Legend />
                          <Bar dataKey="quotaCapitale" stackId="a" name="Quota capitale" fill="#0056b3" />
                          <Bar dataKey="quotaInteressi" stackId="a" name="Quota interessi" fill="#FF8042" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="confronto" className="mt-0 md:mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Dettaglio confronto</CardTitle>
                  <CardDescription>Analisi dei diversi metodi di ammortamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Ammortamento Francese</h3>
                      <p className="text-sm text-gray-600 mb-4">Rata costante per tutta la durata del mutuo. La quota capitale aumenta nel tempo, mentre la quota interessi diminuisce.</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Rata costante:</div>
                        <div className="text-right font-medium">{formatCurrency(data.importoMutuo * (data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate) * Math.pow(1 + data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate), data.durataAnni * getPeriodiPerAnno(data.frequenzaRate))) / (Math.pow(1 + data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate), data.durataAnni * getPeriodiPerAnno(data.frequenzaRate)) - 1))}</div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Ammortamento Italiano</h3>
                      <p className="text-sm text-gray-600 mb-4">Quota capitale costante, mentre la rata totale diminuisce nel tempo. Rate più alte all'inizio, più basse alla fine.</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Prima rata:</div>
                        <div className="text-right font-medium">{formatCurrency((data.importoMutuo / (data.durataAnni * getPeriodiPerAnno(data.frequenzaRate))) + (data.importoMutuo * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate)))}</div>
                        <div>Ultima rata:</div>
                        <div className="text-right font-medium">{formatCurrency((data.importoMutuo / (data.durataAnni * getPeriodiPerAnno(data.frequenzaRate))) + (data.importoMutuo / (data.durataAnni * getPeriodiPerAnno(data.frequenzaRate)) * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate)))}</div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Ammortamento Bullet</h3>
                      <p className="text-sm text-gray-600 mb-4">Si pagano solo gli interessi durante la vita del mutuo, il capitale viene restituito in un'unica soluzione alla scadenza.</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Rata periodica (solo interessi):</div>
                        <div className="text-right font-medium">{formatCurrency(data.importoMutuo * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate))}</div>
                        <div>Pagamento finale:</div>
                        <div className="text-right font-medium">{formatCurrency(data.importoMutuo + (data.importoMutuo * data.tassoInteresse / 100 / getPeriodiPerAnno(data.frequenzaRate)))}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab('base')} className="w-full">
                    Torna al calcolatore
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default MortgageCalculator;
