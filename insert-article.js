// Script to insert a new article into Supabase
// Run with: node insert-article.js

import { createClient } from '@supabase/supabase-js';

// Supabase credentials from your project
const SUPABASE_URL = "https://vavvdnylwwfigezdikfy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdnZkbnlsd3dmaWdlemRpa2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzc4NjYsImV4cCI6MjA2MjY1Mzg2Nn0.wCAFEe6Af3Ncpjspf2Def43Z3nY0R0S8wVkV4mFfBK0";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const articleData = {
  title: "Comprendere l'Adattamento Edonico: Perché i Piaceri della Vita Svaniscono",
  slug: "comprendere-adattamento-edonico",
  excerpt: "L'adattamento edonico è la nostra tendenza a tornare a un livello base di felicità nonostante cambiamenti di vita positivi o negativi. Scopri come funziona e come gestirlo.",
  content: `<h1>Comprendere l'Adattamento Edonico: Perché i Piaceri della Vita Svaniscono</h1>
<p>17 maggio 2025</p>

<p>L'adattamento edonico—la nostra tendenza a tornare a un livello base di felicità nonostante cambiamenti di vita positivi o negativi—è tra i fenomeni più documentati nella ricerca sul benessere. Questo meccanismo psicologico spiega perché sia i vincitori della lotteria che le vittime di incidenti tendono a tornare ai loro livelli di felicità pre-evento nel tempo (Brickman et al., 1978).</p>

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
<ul>
<li>Brickman, P., Coates, D., & Janoff-Bulman, R. (1978). Lottery winners and accident victims: Is happiness relative? Journal of Personality and Social Psychology, 36(8), 917-927.</li>
<li>Bryant, F. B., & Veroff, J. (2007). Savoring: A new model of positive experience. Lawrence Erlbaum Associates Publishers.</li>
<li>Chancellor, J., & Lyubomirsky, S. (2011). Happiness and thrift: When (spending) less is (hedonically) more. Journal of Consumer Psychology, 21(2), 131-138.</li>
<li>Dunn, E. W., Gilbert, D. T., & Wilson, T. D. (2011). If money doesn't make you happy, then you probably aren't spending it right. Journal of Consumer Psychology, 21(2), 115-125.</li>
<li>Emmons, R. A., & McCullough, M. E. (2003). Counting blessings versus burdens: An experimental investigation of gratitude and subjective well-being in daily life. Journal of Personality and Social Psychology, 84(2), 377-389.</li>
<li>Frederick, S., & Loewenstein, G. (1999). Hedonic adaptation. In D. Kahneman, E. Diener, & N. Schwarz (Eds.), Well-being: The foundations of hedonic psychology (pp. 302-329). Russell Sage Foundation.</li>
<li>Sheldon, K. M., & Lyubomirsky, S. (2012). The challenge of staying happier: Testing the Hedonic Adaptation Prevention model. Personality and Social Psychology Bulletin, 38(5), 670-680.</li>
<li>Wilson, T. D., & Gilbert, D. T. (2008). Explaining away: A model of affective adaptation. Perspectives on Psychological Science, 3(5), 370-386.</li>
</ul>`,
  date: "2025-05-17",
  published: true
};

async function insertArticle() {
  try {
    console.log('Inserting article about hedonic adaptation...');
    
    const { data, error } = await supabase
      .from('articles')
      .insert(articleData);
      
    if (error) {
      console.error('Error inserting article:', error);
      return;
    }
    
    console.log('Article inserted successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

insertArticle(); 