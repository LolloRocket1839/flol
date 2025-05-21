import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ArticleCard from '@/components/ArticleCard';

const BlogPage = () => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useTranslation();

  // Debug logging function
  const logDebug = useCallback((message: string, data?: any) => {
    console.log(`[BlogPage] ${message}`, data || '');
  }, []);

  // Cache helper functions
  const getCachedData = useCallback((key: string) => {
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error caching data:', e);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    logDebug('Fetching articles from Supabase');
    
    try {
      // Primo tentativo: recupera articoli dal database
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, date, excerpt, published, icon, category')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) {
        logDebug('Error fetching articles', error);
        throw error;
      }
      
      logDebug('Fetched articles from Supabase', data);
      
      if (data && data.length > 0) {
        // Abbiamo articoli, impostiamo lo stato
        setPosts(data);
        // Salviamo in cache per un accesso più veloce in futuro
        setCachedData('articles', data);
        logDebug('Articles loaded successfully', data);
      } else {
        // Nessun articolo trovato, aggiungiamo quelli predefiniti
        logDebug("No articles found, adding default articles");
        
        const defaultArticles = [
          {
            title: "Bilancio Personale: La Base della Salute Finanziaria",
            slug: "bilancio-personale",
            excerpt: "Il bilancio personale è uno strumento fondamentale che ti permette di tracciare entrate e uscite mensili. Inizia elencando tutte le fonti di reddito e categorizzando le spese.",
            content: `<h2>Bilancio Personale: La Base della Salute Finanziaria</h2>
<p>Il bilancio personale è uno strumento fondamentale che ti permette di tracciare entrate e uscite mensili. Inizia elencando tutte le fonti di reddito e categorizzando le spese (essenziali, discrezionali, risparmi).</p>

<div class="bg-blue-50 border border-[#004D80] rounded-lg p-4 my-6">
  <h3 class="text-[#004D80] font-bold mb-2">Concetto chiave: La regola 50/30/20</h3>
  <p>La regola 50/30/20 suggerisce di destinare il 50% alle necessità, 30% ai desideri e 20% ai risparmi.</p>
</div>

<p>Monitora regolarmente confrontando le spese effettive con quelle pianificate. Un bilancio efficace non limita la libertà ma offre consapevolezza finanziaria, aiutandoti a identificare sprechi, pianificare obiettivi futuri e ridurre l'ansia finanziaria, aumentando il controllo sulle tue finanze.</p>

<h3 class="text-xl font-bold text-[#004D80] mt-6 mb-3">Come creare il tuo bilancio personale</h3>

<ol class="list-decimal pl-6 space-y-2 mb-6">
  <li>Raccogli tutti i tuoi documenti finanziari (estratti conto, buste paga, bollette)</li>
  <li>Identifica e somma tutte le tue fonti di reddito mensile</li>
  <li>Elenca e categorizza tutte le tue spese mensili</li>
  <li>Confronta entrate e uscite</li>
  <li>Stabilisci obiettivi di risparmio realistici</li>
  <li>Monitora e aggiusta regolarmente</li>
</ol>

<div class="bg-green-50 border border-green-500 rounded-lg p-4 my-6">
  <h3 class="text-green-700 font-bold mb-2">Benefici di un bilancio ben strutturato:</h3>
  <ul class="list-disc pl-5 space-y-1">
    <li>Maggiore consapevolezza delle tue abitudini di spesa</li>
    <li>Riduzione dello stress finanziario</li>
    <li>Capacità di pianificare obiettivi futuri</li>
    <li>Prevenzione dell'indebitamento eccessivo</li>
    <li>Costruzione graduale del patrimonio personale</li>
  </ul>
</div>

<p>Ricorda che un bilancio non è una camicia di forza ma uno strumento di libertà finanziaria. Rivedilo periodicamente e adattalo ai cambiamenti della tua vita.</p>`,
            date: new Date().toISOString(),
            published: true,
            icon: "calculator",
            category: "finance"
          },
          {
            title: "Fondo di Emergenza: Il Tuo Salvagente Finanziario",
            slug: "fondo-emergenza",
            excerpt: "Il fondo di emergenza è una riserva finanziaria destinata a coprire spese impreviste come problemi medici, riparazioni domestiche o periodi di disoccupazione.",
            content: `<h2>Fondo di Emergenza: Il Tuo Salvagente Finanziario</h2>
<p>Il fondo di emergenza è una riserva finanziaria destinata a coprire spese impreviste come problemi medici, riparazioni domestiche o periodi di disoccupazione. L'obiettivo ideale è accumulare 3-6 mesi di spese essenziali.</p>

<div class="bg-blue-50 border border-[#004D80] rounded-lg p-4 my-6">
  <h3 class="text-[#004D80] font-bold mb-2">Concetto chiave: Liquidità accessibile ma separata</h3>
  <p>Questo denaro dovrebbe essere facilmente accessibile ma separato dai conti correnti quotidiani, preferibilmente in un conto di risparmio ad alto rendimento.</p>
</div>

<p>Costruiscilo gradualmente, iniziando con un obiettivo di €1.000 e aumentando progressivamente. Un fondo di emergenza solido previene l'indebitamento in situazioni critiche e offre tranquillità psicologica, elemento essenziale per una salute finanziaria robusta.</p>

<h3 class="text-xl font-bold text-[#004D80] mt-6 mb-3">Come costruire il tuo fondo di emergenza</h3>

<ol class="list-decimal pl-6 space-y-2 mb-6">
  <li>Calcola le tue spese mensili essenziali</li>
  <li>Stabilisci un obiettivo iniziale di €1.000</li>
  <li>Imposta trasferimenti automatici verso un conto dedicato</li>
  <li>Aumenta gradualmente fino a raggiungere 3-6 mesi di spese</li>
  <li>Utilizzalo solo per vere emergenze</li>
  <li>Ricostruiscilo rapidamente quando lo utilizzi</li>
</ol>

<div class="bg-yellow-50 border border-yellow-500 rounded-lg p-4 my-6">
  <h3 class="text-yellow-700 font-bold mb-2">Attenzione:</h3>
  <p>Resistere alla tentazione di usare il fondo di emergenza per spese non essenziali o opportunità di investimento è fondamentale per mantenere la tua rete di sicurezza finanziaria intatta.</p>
</div>

<p>Ricorda che la tranquillità di avere un paracadute finanziario ha un valore che va oltre il semplice rendimento monetario che potresti ottenere investendo quei soldi diversamente.</p>`,
            date: new Date().toISOString(),
            published: true,
            icon: "umbrella",
            category: "finance"
          },
          {
            title: "Interesse Composto: L'Ottava Meraviglia del Mondo",
            slug: "interesse-composto",
            excerpt: "L'interesse composto è il \"miracolo finanziario\" che genera guadagni non solo sul capitale iniziale ma anche sugli interessi precedentemente accumulati.",
            content: `<h2>Interesse Composto: L'Ottava Meraviglia del Mondo</h2>
<p>L'interesse composto è il "miracolo finanziario" che genera guadagni non solo sul capitale iniziale ma anche sugli interessi precedentemente accumulati. Con tempo sufficiente, anche piccoli investimenti possono trasformarsi in somme significative.</p>

<div class="bg-blue-50 border border-[#004D80] rounded-lg p-4 my-6">
  <h3 class="text-[#004D80] font-bold mb-2">Concetto chiave: La regola del 72</h3>
  <p>La regola del 72 offre una stima rapida: dividendo 72 per il tasso di rendimento annuo, ottieni gli anni necessari per raddoppiare il capitale.</p>
</div>

<p>Questo concetto è fondamentale per investimenti a lungo termine come fondi pensione. La chiave del successo è iniziare presto: investire €200 mensili dai 25 anni può generare risultati notevolmente superiori rispetto a iniziare dieci anni dopo, anche con contributi maggiori.</p>

<h3 class="text-xl font-bold text-[#004D80] mt-6 mb-3">Un esempio pratico</h3>

<div class="bg-gray-50 rounded-lg p-4 my-6">
  <p class="mb-2"><strong>Scenario A:</strong> Marco inizia a investire €200 al mese a 25 anni con un rendimento medio del 7%</p>
  <p class="mb-2"><strong>Scenario B:</strong> Giulia inizia a investire €400 al mese a 35 anni con lo stesso rendimento del 7%</p>
  <p class="mb-4"><strong>Risultato a 65 anni:</strong></p>
  <ul class="list-disc pl-5 space-y-1">
    <li>Marco avrà accumulato circa €525.000</li>
    <li>Giulia avrà accumulato circa €465.000</li>
  </ul>
  <p class="mt-2">Nonostante Giulia abbia investito il doppio mensilmente, Marco ha ottenuto di più grazie al tempo aggiuntivo di crescita degli interessi.</p>
</div>

<p>L'interesse composto è uno degli strumenti più potenti per costruire ricchezza nel lungo periodo, ma richiede disciplina e pazienza per vederne i benefici completi.</p>`,
            date: new Date().toISOString(),
            published: true,
            icon: "trend",
            category: "finance"
          },
          // Keep the existing default articles
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
            published: true,
            icon: "activity",
            category: "psychology"
          }
        ];
        
        logDebug("Tentativo di inserimento articoli predefiniti");
        
        try {
          // Inserisci gli articoli predefiniti nel database
          const { data: insertedData, error: insertError } = await supabase
            .from('articles')
            .insert(defaultArticles)
            .select();
            
          if (insertError) {
            logDebug('Error inserting default articles', insertError);
            // Se non possiamo inserire nel database, usiamo comunque gli articoli predefiniti nell'UI
            setPosts(defaultArticles);
            toast({
              title: t('articles.usingDefaults'),
              description: t('articles.usingDefaultsAfterError'),
              variant: 'destructive',
            });
          } else {
            logDebug('Default articles inserted successfully', insertedData);
            setPosts(insertedData || defaultArticles);
            toast({
              title: t('articles.success'),
              description: t('articles.defaultsLoaded', { count: insertedData?.length || defaultArticles.length }),
            });
          }
        } catch (e) {
          logDebug('Exception inserting default articles', e);
          // Fallback to using default articles in UI only
          setPosts(defaultArticles);
          toast({
            title: t('articles.usingDefaults'),
            description: t('articles.usingDefaultsAfterError'),
            variant: 'destructive',
          });
        }
      }
      
      toast({
        title: t('articles.success'),
        description: t('articles.loaded', { count: posts.length }),
      });
    } catch (error) {
      console.error("Error in fetchPosts:", error);
      
      // Try to load from cache if available
      const cachedArticles = getCachedData('articles');
      if (cachedArticles && cachedArticles.length > 0) {
        logDebug('Loading articles from cache', cachedArticles);
        setPosts(cachedArticles);
      } else {
        // If no cache, set empty array
        setPosts([]);
      }
      
      toast({
        title: t('thoughtsOfWeek.error'),
        description: t('articles.usingDefaultsAfterError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t, logDebug, setCachedData, getCachedData]);

  // Initial load
  useEffect(() => {
    // Try to load from cache first for immediate display
    const cachedArticles = getCachedData('articles');
    if (cachedArticles && cachedArticles.length > 0) {
      logDebug('Initial load from cache', cachedArticles);
      setPosts(cachedArticles);
      setIsLoading(false);
    }
    
    // Then fetch fresh data
    fetchPosts();
  }, [fetchPosts, getCachedData, logDebug]);

  // Memoize the sorted posts to prevent unnecessary re-renders
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [posts]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fintool-blue mb-2">{t('articles.title')}</h1>
          <p className="text-gray-600">{t('articles.subtitle')}</p>
        </div>
        <Button 
          onClick={fetchPosts} 
          disabled={isRefreshing}
          className="mt-4 md:mt-0"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t('articles.refreshing') : t('articles.refresh')}
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <ArticleCard key={post.id} article={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl mb-4">{t('articles.noArticles')}</p>
          <Button onClick={fetchPosts}>
            {t('articles.loadDefault')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
