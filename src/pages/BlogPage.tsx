
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types/article';
import { Loader2 } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
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
        
        // Log the retrieved data
        console.log("Retrieved articles:", data);
        
        // If no articles found in the database, add default articles
        if (!data || data.length === 0) {
          console.log("No articles found, adding default articles...");
          
          const defaultArticles = [
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
      }
    };

    fetchPosts();
  }, []);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">Nessun articolo pubblicato.</p>
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
                )}
                
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
