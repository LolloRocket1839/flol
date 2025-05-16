
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';

const BlogPage = () => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching articles from Supabase...");
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
      
      console.log("Retrieved articles:", data);
      
      // If no articles found in the database, add default articles
      if (!data || data.length === 0) {
        console.log("No articles found, adding default articles...");
        
        const defaultArticles = [
          {
            title: "Il Potere dei Piccoli Risparmi Regolari",
            slug: "potere-piccoli-risparmi-regolari",
            excerpt: "Gli studi rivelano che le persone che risparmiano piccole somme con regolarità accumulano patrimoni significativamente maggiori rispetto a chi fa pochi investimenti consistenti.",
            content: `<h1>Il Potere dei Piccoli Risparmi Regolari: La Strategia Che Batte i Grandi Investimenti Occasionali</h1>
<p>Hai mai pensato che per costruire un patrimonio significativo servano grandi somme di denaro? Forse sogni di fare quell'investimento importante "appena avrai messo da parte abbastanza". Questa convinzione, per quanto diffusa, è uno dei più grandi ostacoli alla costruzione di ricchezza per le famiglie normali.</p>

<h2>Perché i Piccoli Risparmi Regolari Funzionano Meglio</h2>
<p>Gli studi condotti dalle principali istituzioni finanziarie come Banca d'Italia e Deutsche Bank rivelano un pattern sorprendente: le persone che risparmiano piccole somme con regolarità accumulano patrimoni significativamente maggiori rispetto a chi fa pochi investimenti consistenti, anche quando la somma totale investita è identica.</p>

<p>Prendiamo un esempio concreto: Carlo decide di investire 100€ ogni mese per 10 anni in un fondo con rendimento medio del 6%. Alla fine del periodo avrà versato 12.000€ che, grazie all'interesse composto, saranno diventati circa 16.300€.</p>

<p>La sua amica Giulia, invece, preferisce risparmiare finché non accumula una somma importante. Investe 6.000€ all'inizio del periodo e altri 6.000€ alla fine dello stesso decennio. Nonostante abbia investito la stessa somma totale (12.000€), alla fine Giulia avrà circa 14.500€, quasi 2.000€ in meno di Carlo.</p>

<p>Questa differenza si amplifica ulteriormente su periodi più lunghi, dimostrando che la costanza batte quasi sempre la strategia del "grande investimento".</p>

<h2>I Tre Motivi Matematici Dietro Questo Fenomeno</h2>
<p>Ci sono tre principi matematici e finanziari che spiegano perché i piccoli investimenti regolari funzionano così bene:</p>

<h3>1. L'Interesse Composto Lavora Più a Lungo</h3>
<p>Quando investi regolarmente, i tuoi primi risparmi hanno più tempo per moltiplicarsi. L'interesse composto, che Einstein definiva "l'ottava meraviglia del mondo", funziona meglio quanto più tempo ha a disposizione.</p>

<p>Un euro investito oggi vale potenzialmente più di un euro investito tra un anno perché avrà 12 mesi in più per generare rendimenti che a loro volta generano altri rendimenti. Moltiplicato per centinaia di versamenti mensili, questo vantaggio diventa sostanziale.</p>

<h3>2. Il Dollar-Cost Averaging Riduce il Rischio</h3>
<p>Investire regolarmente piccole somme ti permette di applicare automaticamente la strategia che i professionisti chiamano "dollar-cost averaging" o "piano di accumulo". In pratica, acquisti più quote quando i prezzi sono bassi e meno quote quando i prezzi sono alti.</p>

<p>Questo approccio riduce significativamente il rischio di timing sbagliato, cioè di investire tutto il tuo capitale proprio quando i mercati sono ai massimi. Uno studio di Vanguard ha dimostrato che questa strategia riduce la volatilità del portafoglio di circa il 18% rispetto agli investimenti in un'unica soluzione.</p>

<h3>3. Massimizzi l'Efficienza del Tuo Flusso di Cassa</h3>
<p>Con i piccoli versamenti regolari, mantieni sempre una riserva di liquidità per le emergenze, evitando di dover liquidare investimenti in momenti sfavorevoli. Questo ti consente anche di sfruttare eventuali opportunità che si presentano, come una correzione di mercato o un investimento particolarmente vantaggioso.</p>

<h2>I Vantaggi Psicologici Che Rendono Questa Strategia Imbattibile</h2>
<p>La vera forza dei piccoli risparmi regolari, tuttavia, risiede nei vantaggi psicologici che offrono:</p>

<h3>È Sostenibile nel Tempo</h3>
<p>La ricerca comportamentale mostra che è molto più facile abituarsi a non avere 100€ al mese che rinunciare a 5.000€ in un colpo solo. Proprio come è più facile fare una breve camminata ogni giorno piuttosto che una maratona una volta all'anno.</p>

<h3>Diventa un'Abitudine Automatica</h3>
<p>Quando imposti un bonifico automatico per i tuoi risparmi, elimini la necessità di decidere ogni volta e superi la resistenza psicologica al risparmio. Gli studi di Thaler e Benartzi sul programma "Save More Tomorrow" hanno dimostrato che l'automatizzazione aumenta i tassi di risparmio del 250-300% rispetto alle decisioni manuali.</p>

<h3>Crea Gratificazione e Motivazione</h3>
<p>Vedere crescere gradualmente il proprio patrimonio crea un ciclo di feedback positivo che rafforza l'abitudine. Un esperimento condotto dall'Università di Chicago ha mostrato che le persone che potevano monitorare regolarmente la crescita dei loro risparmi erano il 27% meno propense ad abbandonare il loro piano di risparmio rispetto a chi controllava solo occasionalmente.</p>

<h2>Come Mettere in Pratica Questa Strategia (Anche Partendo da Zero)</h2>
<p>La buona notizia è che puoi iniziare questa strategia con qualsiasi somma, anche minima. Ecco come procedere:</p>

<h3>1. Trova il Tuo "Numero Sostenibile"</h3>
<p>Non esiste un importo "giusto" in assoluto. Che siano 30€, 100€ o 500€ al mese, scegli una cifra che puoi mantenere senza sforzo. È meglio iniziare con una somma piccola che puoi sostenere nel tempo piuttosto che con una grande che ti costringerà a interrompere il piano dopo pochi mesi.</p>

<p>Gli esperti di finanza personale suggeriscono di iniziare risparmiando almeno il 10% del proprio reddito, ma se sei all'inizio del percorso, puoi partire anche dal 5% e aumentare gradualmente.</p>

<h3>2. Automatizza il Processo</h3>
<p>Imposta un bonifico automatico che trasferisca l'importo scelto dal tuo conto corrente al tuo conto di risparmio o investimento il giorno stesso in cui ricevi lo stipendio. Questa semplice azione elimina la tentazione di spendere prima e risparmiare "quello che resta" (che spesso è zero).</p>

<p>Uno studio della National Bureau of Economic Research ha dimostrato che chi automatizza i propri risparmi accumula in media il 68% in più rispetto a chi effettua versamenti manuali, anche a parità di importo teorico.</p>

<h3>3. Tratta il Tuo Risparmio Come una Bolletta Non Negoziabile</h3>
<p>Considera questi soldi come già spesi, come faresti con l'affitto o una bolletta. Non sono "extra" che puoi decidere di usare per altri scopi; sono un pagamento che fai al tuo futuro io.</p>

<h3>4. Aumenta Gradualmente l'Importo</h3>
<p>Una strategia particolarmente efficace è quella di aumentare l'importo risparmiato ogni volta che ricevi un aumento di stipendio. Ad esempio, se ottieni un aumento del 5%, potresti destinare metà di questo aumento (2,5%) ai tuoi risparmi.</p>

<p>Questo approccio ti permette di migliorare sia il tuo tenore di vita presente che la tua sicurezza futura, senza avvertire una sensazione di "perdita" o sacrificio.</p>

<h2>Il Vero Segreto: La Costanza Batte Tutto</h2>
<p>Il messaggio più importante da ricordare è che non è quanto risparmi in un singolo mese che fa la differenza, ma la costanza nel tempo. La matematica finanziaria è chiara: è meglio risparmiare 50€ ogni mese per sempre che 200€ per tre mesi e poi smettere perché è troppo difficile.</p>

<p>Come dice il vecchio proverbio cinese: "Il momento migliore per piantare un albero era vent'anni fa. Il secondo momento migliore è adesso." Non aspettare di avere la somma "giusta" per iniziare a costruire il tuo patrimonio. Inizia oggi, con qualunque cifra ti sia possibile, e lascia che il tempo e la costanza lavorino per te.</p>`,
            date: new Date().toISOString(),
            published: true
          },
          {
            title: "I Costi Nascosti Che Divorano i Tuoi Investimenti",
            slug: "costi-nascosti-investimenti",
            excerpt: "Quando parliamo di investimenti, tendiamo a concentrarci sui rendimenti potenziali, ma c'è un elemento cruciale che spesso passa in secondo piano: i costi.",
            content: `<h1>I Costi Nascosti Che Divorano i Tuoi Investimenti: La Guida Completa per Proteggere il Tuo Patrimonio</h1>
<p>Quando parliamo di investimenti, tendiamo a concentrarci principalmente sui rendimenti potenziali: "Questo fondo ha reso il 7% nell'ultimo anno!" o "Quell'azione è cresciuta del 12% in sei mesi!". Ma c'è un elemento cruciale che spesso passa in secondo piano e che, nel lungo periodo, può fare una differenza enorme sui tuoi risultati finanziari: i costi.</p>

<h2>L'Effetto Devastante delle Commissioni: I Numeri Non Mentono</h2>
<p>Per capire l'impatto reale delle commissioni, consideriamo un esempio concreto basato su uno studio della Securities and Exchange Commission americana.</p>

<p>Immagina di investire 10.000€ in due fondi diversi, entrambi con un rendimento lordo annuo dell'8%:</p>

<ul>
<li>Il Fondo A ha commissioni totali dell'1% all'anno</li>
<li>Il Fondo B ha commissioni totali del 2% all'anno</li>
</ul>

<p>Dopo 30 anni, ecco cosa accadrebbe:</p>

<ul>
<li>Con il Fondo A avresti circa 85.000€</li>
<li>Con il Fondo B avresti solo 57.000€</li>
</ul>

<p>La differenza? Quasi 30.000€ persi in commissioni apparentemente "piccole". In percentuale, hai rinunciato a circa il 35% del potenziale guadagno, semplicemente per aver scelto un investimento con costi leggermente più alti.</p>

<p>Questo fenomeno si verifica per tre motivi fondamentali:</p>

<ol>
<li>Le commissioni si applicano ogni anno, non una tantum. Anche una piccola percentuale, ripetuta per decenni, diventa significativa.</li>
<li>Le commissioni riducono la base su cui maturano gli interessi composti. Se il tuo rendimento lordo è dell'8% ma paghi il 2% di commissioni, ti resta solo il 6% che può generare interessi composti negli anni successivi.</li>
<li>Spesso le commissioni aumentano con la crescita del tuo patrimonio. Man mano che i tuoi investimenti crescono, paghi sempre di più in termini assoluti, anche se la percentuale rimane identica.</li>
</ol>

<h2>I Costi Che Non Vedi: L'Iceberg Finanziario</h2>
<p>Le commissioni esplicite, quelle che vedi chiaramente nei documenti, rappresentano solo la punta dell'iceberg. Sotto la superficie si nascondono numerosi altri costi che erodono silenziosamente i tuoi rendimenti.</p>

<p>Gli studi approfonditi di Morningstar e del Financial Analyst Journal hanno identificato almeno sei tipologie di costi nascosti che la maggior parte degli investitori non considera mai:</p>

<h3>1. Costi di Transazione</h3>
<p>Ogni volta che il gestore del tuo fondo compra o vende titoli, si generano costi di transazione. Un fondo che fa trading frequentemente può accumulare costi di transazione significativi, che non sono inclusi nel TER (Total Expense Ratio) dichiarato.</p>

<p>I ricercatori di Morningstar hanno stimato che questi costi possono aggiungere tra lo 0,2% e l'1,2% di spese annue non dichiarate, a seconda della strategia del fondo.</p>

<h3>2. Spread Bid-Ask</h3>
<p>Quando si compra o vende un titolo, esiste sempre una differenza tra il prezzo di acquisto (bid) e quello di vendita (ask). Questa differenza, chiamata spread, è un costo reale ma invisibile.</p>

<p>Per fondi che investono in mercati meno liquidi o in titoli di piccole dimensioni, gli spread possono essere significativi e aggiungere ulteriori costi nascosti stimabili tra lo 0,1% e lo 0,5% annuo.</p>

<h3>3. Commissioni di Performance</h3>
<p>Molti fondi addebitano commissioni extra se ottengono buoni risultati. Questa pratica sembra equa a prima vista, ma presenta diversi problemi:</p>

<ul>
<li>Spesso paghi per la performance anche quando il fondo ha semplicemente seguito l'andamento del mercato</li>
<li>Raramente ci sono penalità per le performance negative</li>
<li>Crei un incentivo per i gestori ad assumere rischi eccessivi per raggiungere la soglia di bonus</li>
</ul>

<h3>4. Caricamenti Iniziali o di Uscita</h3>
<p>Alcuni investimenti prevedono commissioni una tantum all'ingresso o all'uscita. Un caricamento iniziale del 3%, ad esempio, significa che solo 97€ di ogni 100€ investiti vengono effettivamente impiegati per te.</p>

<h3>5. Inefficienza Fiscale</h3>
<p>I fondi che fanno trading frequente generano guadagni in conto capitale che possono comportare tasse più elevate per te. Uno studio dell'Università di Chicago ha stimato che l'inefficienza fiscale costa agli investitori medi tra lo 0,5% e l'1% annuo in rendimenti persi.</p>

<h3>6. Costi di Opportunità</h3>
<p>Molti fondi mantengono una parte significativa del patrimonio in liquidità per gestire riscatti potenziali. Questa liquidità, che può arrivare al 5-10% del fondo, tipicamente genera rendimenti molto bassi, riducendo il tuo rendimento complessivo.</p>

<h2>L'Esempio Reale: Quanto Costa Davvero il Tuo Investimento</h2>
<p>Mettiamo insieme tutti questi elementi per un fondo d'investimento tipico che dichiara commissioni di gestione dell'1,5%:</p>

<ul>
<li>Commissione di gestione dichiarata: 1,5%</li>
<li>Costi di transazione non dichiarati: 0,5%</li>
<li>Spread bid-ask: 0,2%</li>
<li>Inefficienza fiscale: 0,7%</li>
<li>Costo della liquidità in eccesso: 0,2%</li>
</ul>

<p>Costo totale reale: 3,1% all'anno</p>

<p>Questo significa che se il mercato rende l'8% lordo in media, il tuo rendimento netto sarebbe solo del 4,9% anziché del 6,5% che avresti immaginato considerando solo la commissione dichiarata. Su 30 anni, questa differenza può ridurre il tuo patrimonio finale di oltre il 40%!</p>

<h2>Come Proteggerti: Strategie Concrete per Minimizzare i Costi</h2>
<p>La buona notizia è che esistono strategie efficaci per ridurre drasticamente questi costi e proteggere i tuoi rendimenti:</p>

<h3>1. Verifica Sempre il TER (Total Expense Ratio)</h3>
<p>Il TER include più voci di costo rispetto alla semplice commissione di gestione. Anche se non cattura tutti i costi nascosti, è comunque un indicatore più completo. Cerca investimenti con un TER inferiore all'1% per fondi attivi e preferibilmente sotto lo 0,3% per fondi passivi.</p>

<h3>2. Considera Seriamente gli ETF a Basso Costo</h3>
<p>Gli Exchange Traded Funds (ETF) passivi che replicano semplicemente un indice offrono tipicamente commissioni totali molto inferiori rispetto ai fondi a gestione attiva. Molti ETF di qualità hanno commissioni totali sotto lo 0,2% annuo.</p>

<p>Uno studio di lungo periodo di S&P Dow Jones Indices ha mostrato che oltre il 90% dei fondi attivi non riesce a battere il proprio indice di riferimento nell'arco di 15 anni, principalmente a causa dei costi più elevati.</p>

<h3>3. Fai Attenzione al "Turnover" del Portafoglio</h3>
<p>Il turnover misura quanto frequentemente un fondo compra e vende i titoli in portafoglio. Un turnover del 100% significa che l'intero portafoglio viene rimpiazzato nell'arco di un anno.</p>

<p>Cerca fondi con basso turnover (preferibilmente sotto il 50%) per minimizzare i costi di transazione nascosti e le inefficienze fiscali.</p>

<h3>4. Evita i Caricamenti Iniziali e di Uscita</h3>
<p>Oggi esistono molte alternative di qualità senza commissioni di ingresso o uscita. Non c'è motivo di accettare questi costi aggiuntivi che riducono immediatamente il capitale investito o quello che recuperi.</p>

<h3>5. Diffida delle Promesse di Rendimenti Eccezionali</h3>
<p>I rendimenti passati elevati spesso mascherano costi elevati o rischi eccessivi. Ricorda il vecchio adagio di Wall Street: "Più alto è il rendimento promesso, più in piccolo è scritta la parte sui rischi."</p>

<h3>6. Considera la Fiscalità nella Tua Strategia</h3>
<p>Scegli strumenti fiscalmente efficienti e considera l'impatto fiscale delle tue decisioni di investimento. Per esempio, gli ETF tendono ad essere più efficienti dal punto di vista fiscale rispetto ai fondi comuni tradizionali.</p>

<h2>L'Impatto nel Mondo Reale: La Storia di Due Investitori</h2>
<p>Per capire meglio l'importanza di questo tema, consideriamo due investitori, entrambi 30enni che risparmiano 300€ al mese per la pensione fino a 65 anni:</p>

<ul>
<li>Marco investe in fondi con costi totali del 2,5% annuo (includendo tutti i costi nascosti)</li>
<li>Laura sceglie ETF a basso costo con spese totali dello 0,3% annuo</li>
</ul>

<p>Assumendo un rendimento lordo del mercato del 7% annuo:</p>

<ul>
<li>Marco si ritroverà con circa 380.000€ a 65 anni</li>
<li>Laura accumulerà circa 650.000€ nello stesso periodo</li>
</ul>

<p>La differenza? Oltre 270.000€, quasi il 70% in più, semplicemente prestando attenzione ai costi!</p>

<h2>Conclusione: Piccoli Numeri, Grandi Differenze</h2>
<p>I costi possono sembrare dettagli marginali quando si scelgono investimenti, ma nel lungo periodo rappresentano uno dei fattori più determinanti per il successo finanziario. Come dice John Bogle, fondatore di Vanguard: "Nel mondo degli investimenti, non ottieni ciò che paghi. Ottieni ciò che non paghi."</p>

<p>Ricorda che risparmiare l'1-2% di costi all'anno può sembrare poco significativo oggi, ma nel lungo periodo può letteralmente significare centinaia di migliaia di euro di differenza nel tuo patrimonio finale. Pochi minuti dedicati a comprendere e minimizzare i costi dei tuoi investimenti potrebbero essere tra i minuti più redditizi della tua vita.</p>`,
            date: new Date().toISOString(),
            published: true
          },
          {
            title: "Comprendere l'Adattamento Edonico: Perché i Piaceri della Vita Svaniscono",
            slug: "comprendere-adattamento-edonico",
            excerpt: "L'adattamento edonico—la nostra tendenza a tornare a un livello base di felicità nonostante cambiamenti di vita positivi o negativi—è tra i fenomeni più documentati nella ricerca sul benessere.",
            content: `<p>L'adattamento edonico—la nostra tendenza a tornare a un livello base di felicità nonostante cambiamenti di vita positivi o negativi—è tra i fenomeni più documentati nella ricerca sul benessere. Questo meccanismo psicologico spiega perché sia i vincitori della lotteria che le vittime di incidenti tendono a tornare ai loro livelli di felicità pre-evento nel tempo (Brickman et al., 1978).</p>

<h2>La Scienza Dietro l'Adattamento</h2>

<p>Il processo di adattamento edonico sembra essere neurologicamente cablato. Come Wilson e Gilbert (2008) hanno dimostrato attraverso il loro modello AREA (Attenzione, Reazione, Spiegazione e Adattamento), i nostri cervelli elaborano automaticamente gli eventi emotivi per renderli meno emotivamente impattanti nel tempo. Questo processo inizia con cambiamenti di attenzione—inizialmente ci concentriamo intensamente su nuovi possedimenti o cambiamenti di vita ma gradualmente prestiamo meno attenzione ad essi.</p>

<p>La ricerca di Frederick e Loewenstein (1999) ha ulteriormente stabilito che l'adattamento si verifica più completamente per esperienze costanti (come una nuova automobile) e meno completamente per esperienze variabili o imprevedibili (come relazioni significative). Questo spiega perché gli acquisti materiali tipicamente forniscono aumenti di felicità più brevi rispetto a quelli esperienziali.</p>

<h2>Implicazioni per il Processo Decisionale</h2>

<p>Comprendere l'adattamento edonico ha implicazioni significative per il benessere. Dunn et al. (2011) hanno scoperto che i consumatori che anticipano l'adattamento prendono decisioni di acquisto fondamentalmente diverse, preferendo esperienze rispetto a beni materiali e varietà rispetto a consistenza. I loro esperimenti hanno dimostrato che i partecipanti che erano stati educati sull'adattamento edonico successivamente hanno riportato maggiore soddisfazione con le loro decisioni di acquisto.</p>

<p>Forse più significativamente, Chancellor e Lyubomirsky (2011) hanno dimostrato che interrompere intenzionalmente l'adattamento attraverso esercizi di apprezzamento e attenzione consapevole agli aspetti positivi della vita può estendere i benefici di felicità dei cambiamenti positivi. I loro studi longitudinali hanno mostrato che semplici interventi di gratitudine hanno ridotto i tassi di adattamento di circa il 15% in un periodo di tre mesi.</p>

<h2>Applicazioni Pratiche</h2>

<p>Le strategie basate sulla ricerca per gestire l'adattamento edonico includono:</p>

<ul>
<li><strong>Ricerca di Varietà:</strong> Sheldon e Lyubomirsky (2012) hanno scoperto che introdurre varietà nelle attività positive estendeva significativamente i loro benefici edonici. I loro partecipanti che intenzionalmente variavano il modo in cui si impegnavano con esperienze positive mostravano il 31% in meno di adattamento rispetto ai gruppi di controllo.</li>

<li><strong>Pratiche di Assaporamento:</strong> Il lavoro di Bryant e Veroff (2007) sull'assaporamento—l'atto di prestare attenzione e migliorare le esperienze positive—ha dimostrato che le pratiche di assaporamento deliberato riducevano i tassi di adattamento aiutando gli individui a estrarre più gioia dalle esperienze positive.</li>

<li><strong>Interventi di Apprezzamento:</strong> Emmons e McCullough (2003) hanno mostrato che le espressioni regolari di gratitudine, particolarmente quelle scritte, aiutavano a contrastare l'adattamento reindirizzando l'attenzione agli aspetti positivi delle esperienze che altrimenti potrebbero essere date per scontate.</li>
</ul>

<p>Comprendere e gestire attivamente l'adattamento edonico permette agli individui di derivare una soddisfazione più duratura dalle esperienze di vita positive e prendere decisioni che promuovono un benessere più duraturo piuttosto che una felicità fugace.</p>

<h2>Riferimenti</h2>

<p>Brickman, P., Coates, D., & Janoff-Bulman, R. (1978). Lottery winners and accident victims: Is happiness relative? Journal of Personality and Social Psychology, 36(8), 917-927.</p>

<p>Bryant, F. B., & Veroff, J. (2007). Savoring: A new model of positive experience. Lawrence Erlbaum Associates Publishers.</p>

<p>Chancellor, J., & Lyubomirsky, S. (2011). Happiness and thrift: When (spending) less is (hedonically) more. Journal of Consumer Psychology, 21(2), 131-138.</p>

<p>Dunn, E. W., Gilbert, D. T., & Wilson, T. D. (2011). If money doesn't make you happy, then you probably aren't spending it right. Journal of Consumer Psychology, 21(2), 115-125.</p>

<p>Emmons, R. A., & McCullough, M. E. (2003). Counting blessings versus burdens: An experimental investigation of gratitude and subjective well-being in daily life. Journal of Personality and Social Psychology, 84(2), 377-389.</p>

<p>Frederick, S., & Loewenstein, G. (1999). Hedonic adaptation. In D. Kahneman, E. Diener, & N. Schwarz (Eds.), Well-being: The foundations of hedonic psychology (pp. 302-329). Russell Sage Foundation.</p>

<p>Sheldon, K. M., & Lyubomirsky, S. (2012). The challenge of staying happier: Testing the Hedonic Adaptation Prevention model. Personality and Social Psychology Bulletin, 38(5), 670-680.</p>

<p>Wilson, T. D., & Gilbert, D. T. (2008). Explaining away: A model of affective adaptation. Perspectives on Psychological Science, 3(5), 370-386.</p>`,
            date: new Date().toISOString(),
            published: true
          },
          {
            title: "La Scienza della Formazione delle Abitudini: Oltre la Forza di Volontà",
            slug: "scienza-formazione-abitudini",
            excerpt: "Le abitudini—routine comportamentali automatiche innescate da stimoli contestuali—rappresentano circa il 43% delle nostre azioni quotidiane secondo la ricerca di Wood et al. (2002).",
            content: `<p>Le abitudini—routine comportamentali automatiche innescate da stimoli contestuali—rappresentano circa il 43% delle nostre azioni quotidiane secondo la ricerca di Wood et al. (2002). Mentre la saggezza convenzionale enfatizza la forza di volontà e la motivazione per il cambiamento comportamentale, la ricerca moderna rivela che comprendere i meccanismi della formazione delle abitudini offre percorsi più affidabili per un cambiamento duraturo.</p>

<h2>La Base Neurologica delle Abitudini</h2>

<p>I meccanismi neurali alla base delle abitudini sono stati ben documentati attraverso studi di neuroimaging. La ricerca di Graybiel (2008) ha dimostrato che le abitudini sono principalmente codificate nella regione dei gangli della base del cervello, in particolare nello striato. Man mano che i comportamenti diventano abituali, il controllo si sposta dalla corteccia prefrontale (associata al processo decisionale deliberato) a queste strutture cerebrali più profonde che facilitano l'esecuzione automatica.</p>

<p>Questa transizione neurologica spiega perché le abitudini consolidate richiedono un'attenzione cosciente minima e continuano nonostante le fluttuazioni nella motivazione. Come Duhigg (2012) ha riassunto dalla ricerca neuroscientifica, le abitudini creano "blocchi" neurali dove intere sequenze comportamentali vengono innescate da un singolo stimolo, operando al di sotto della consapevolezza cosciente.</p>

<h2>Il Ciclo dell'Abitudine: Segnale, Routine, Ricompensa</h2>

<p>La ricerca di Schultz (2016) ha identificato la struttura a tre componenti delle abitudini: segnale (innesco), routine (comportamento) e ricompensa (risultato). Questo "ciclo dell'abitudine" è stato costantemente convalidato in diversi contesti comportamentali.</p>

<p>La componente di ricompensa si rivela particolarmente cruciale. La ricerca dopaminergica di Schultz et al. (1997) ha dimostrato che il rilascio di dopamina si verifica inizialmente durante la fase di ricompensa ma gradualmente si sposta alla fase di segnale man mano che le abitudini si formano. Questo spiega perché le abitudini consolidate possono persistere molto tempo dopo che le ricompense diminuiscono—l'anticipazione stessa diventa gratificante.</p>

<h2>Scienza dell'Implementazione: Rendere Affidabile la Formazione delle Abitudini</h2>

<p>Andando oltre la comprensione teorica, la ricerca sull'implementazione ha identificato approcci specifici che facilitano in modo affidabile la formazione delle abitudini:</p>

<ul>
<li><strong>Intenzioni di Implementazione:</strong> La meta-analisi di Gollwitzer e Sheeran (2006) sulle intenzioni di implementazione—piani specifici se-allora che collegano stimoli situazionali a azioni desiderate—ha rilevato che questo approccio aumentava i tassi di successo della formazione di abitudini del 91% rispetto alle sole intenzioni di obiettivo.</li>

<li><strong>Stabilità Contestuale:</strong> Wood et al. (2005) hanno dimostrato che la coerenza ambientale ha un impatto drammatico sulla formazione delle abitudini. La loro ricerca ha mostrato che le abitudini si formano approssimativamente il 20% più velocemente in ambienti stabili e persistono il 60% più a lungo quando gli stimoli ambientali rimangono coerenti.</li>

<li><strong>Sforzo Minimo Vitale:</strong> La ricerca di Fogg (2020) sulle "piccole abitudini" ha dimostrato che minimizzare lo sforzo richiesto aumenta lo sviluppo dell'automaticità. I suoi studi longitudinali hanno mostrato che i comportamenti che richiedono meno di 30 secondi per essere eseguiti hanno formato abitudini stabili in una media di 18 giorni, rispetto ai 66 giorni per comportamenti più complessi.</li>
</ul>

<h2>Il Mito della Regola dei 21 Giorni</h2>

<p>Contrariamente alla credenza popolare, Lally et al. (2010) hanno scoperto che il tempo di formazione delle abitudini varia sostanzialmente in base alla complessità del comportamento e alle differenze individuali. La loro ricerca ha tracciato la formazione delle abitudini attraverso molteplici comportamenti e individui, trovando che lo sviluppo dell'automaticità variava da 18 a 254 giorni, con una mediana di 66 giorni. Questa ricerca contraddice direttamente la ampiamente citata ma non supportata "regola dei 21 giorni" per la formazione delle abitudini.</p>

<p>Più significativamente, la loro ricerca ha identificato una curva matematica della formazione delle abitudini, mostrando che l'automaticità si sviluppa rapidamente durante le prime ripetizioni ma poi aumenta più lentamente fino a raggiungere un asintoto. Questo spiega perché l'iniziazione di un'abitudine spesso sembra difficile ma diventa progressivamente più facile con la ripetizione costante.</p>

<h2>Applicazioni Pratiche</h2>

<p>Le strategie basate sulla ricerca per la formazione delle abitudini includono:</p>

<ul>
<li><strong>Habit Stacking:</strong> Clear (2018) ha dimostrato l'efficacia di collegare nuove abitudini a routine consolidate. I suoi studi sul campo hanno mostrato che l'"habit stacking" (usare un'abitudine esistente come segnale per una nuova abitudine) aumentava la continuità del 37% rispetto all'uso di segnali arbitrari.</li>

<li><strong>Accorpamento di Tentazioni:</strong> Milkman et al. (2014) hanno scoperto che accoppiare comportamenti voluti con attività immediatamente gratificanti aumentava l'aderenza del 29-34%. Il loro studio controllato con la frequenza in palestra ha mostrato che limitare gli audiolibri piacevoli alle sessioni di allenamento aumentava significativamente la frequenza dell'esercizio.</li>

<li><strong>Design Ambientale:</strong> Neal et al. (2012) hanno dimostrato che la ristrutturazione ambientale—modificare gli spazi fisici per facilitare i comportamenti desiderati—aumentava i tassi di successo della formazione delle abitudini del 39-47% rispetto agli interventi incentrati sulla motivazione.</li>
</ul>

<p>Comprendere la scienza della formazione delle abitudini permette agli individui di lavorare con piuttosto che contro i meccanismi naturali del loro cervello, rendendo il cambiamento comportamentale più affidabile e sostenibile rispetto agli approcci che si basano principalmente sulla motivazione e sulla forza di volontà.</p>

<h2>Riferimenti</h2>

<p>Clear, J. (2018). Atomic habits: An easy & proven way to build good habits & break bad ones. Penguin.</p>

<p>Duhigg, C. (2012). The power of habit: Why we do what we do in life and business. Random House.</p>

<p>Fogg, B. J. (2020). Tiny habits: The small changes that change everything. Houghton Mifflin Harcourt.</p>

<p>Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta‐analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69-119.</p>

<p>Graybiel, A. M. (2008). Habits, rituals, and the evaluative brain. Annual Review of Neuroscience, 31, 359-387.</p>

<p>Lally, P., Van Jaarsveld, C. H., Potts, H. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology, 40(6), 998-1009.</p>

<p>Milkman, K. L., Minson, J. A., & Volpp, K. G. (2014). Holding the Hunger Games hostage at the gym: An evaluation of temptation bundling. Management Science, 60(2), 283-299.</p>

<p>Neal, D. T., Wood, W., Labrecque, J. S., & Lally, P. (2012). How do habits guide behavior? Perceived and actual triggers of habits in daily life. Journal of Experimental Social Psychology, 48(2), 492-498.</p>

<p>Schultz, W. (2016). Dopamine reward prediction error coding. Dialogues in Clinical Neuroscience, 18(1), 23-32.</p>

<p>Schultz, W., Dayan, P., & Montague, P. R. (1997). A neural substrate of prediction and reward. Science, 275(5306), 1593-1599.</p>

<p>Wood, W., Quinn, J. M., & Kashy, D. A. (2002). Habits in everyday life: Thought, emotion, and action. Journal of Personality and Social Psychology, 83(6), 1281-1297.</p>

<p>Wood, W., Tam, L., & Witt, M. G. (2005). Changing circumstances, disrupting habits. Journal of Personality and Social Psychology, 88(6), 918-933.</p>`,
            date: new Date().toISOString(),
            published: true
          }
        ];
        
        console.log("Inserendo articoli predefiniti...");
        
        // Elimino gli articoli esistenti e inserisco quelli nuovi
        try {
          // Prima elimino gli articoli esistenti
          const { error: deleteError } = await supabase
            .from('articles')
            .delete()
            .eq('published', true);
            
          if (deleteError) {
            console.error("Errore durante l'eliminazione degli articoli:", deleteError);
            // Continua comunque con l'inserimento
          }
          
          // Poi inserisco i nuovi articoli
          for (const article of defaultArticles) {
            const { error: insertError } = await supabase
              .from('articles')
              .insert([article]);
              
            if (insertError) {
              console.error("Errore durante l'inserimento dell'articolo:", insertError);
              throw insertError;
            }
          }
          
          console.log("Articoli predefiniti inseriti, recuperando...");
          
          // Fetch again to get the newly inserted articles with their IDs
          const { data: refreshedData, error: refreshError } = await supabase
            .from('articles')
            .select('*')
            .eq('published', true)
            .order('date', { ascending: false });
            
          if (refreshError) {
            console.error("Errore durante il recupero degli articoli aggiornati:", refreshError);
            throw refreshError;
          }
          
          console.log("Articoli recuperati dopo l'inserimento:", refreshedData);
          setPosts(refreshedData || []);
        } catch (error: any) {
          console.error("Errore durante la gestione degli articoli:", error);
          toast({
            title: 'Errore',
            description: error.message || 'Impossibile aggiornare gli articoli',
            variant: 'destructive',
          });
        }
      } else {
        console.log("Articoli trovati nel database:", data.length);
        setPosts(data);
      }
    } catch (error: any) {
      console.error("Errore catturato nel blocco try-catch:", error);
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile caricare gli articoli',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPosts();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fintool-blue mb-4">Articoli</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Approfondimenti e guide sul mondo della finanza personale
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Aggiorna articoli
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-6">Nessun articolo trovato.</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Caricamento...
              </>
            ) : (
              'Carica articoli predefiniti'
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {currentPosts.map((post) => (
              <Card key={post.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>
                    <Link to={`/articoli/${post.slug}`} className="hover:text-fintool-teal transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {new Date(post.date).toLocaleDateString('it-IT', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline">
                    <Link to={`/articoli/${post.slug}`}>Leggi l'articolo</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <PaginationItem key={number}>
                    <PaginationLink 
                      isActive={currentPage === number} 
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => paginate(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPage;
