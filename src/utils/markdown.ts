
import { marked } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

// Hardcoded blog posts for this demo
// In a real Next.js app this would use fs to read from actual files
const blogPosts: Record<string, BlogPost> = {
  'primo-articolo': {
    slug: 'primo-articolo',
    title: 'Come iniziare a investire con piccole somme',
    date: '2023-05-15',
    excerpt: 'Una guida per chi vuole iniziare a investire anche con piccole somme di denaro',
    content: `<h1 id="come-iniziare-a-investire-con-piccole-somme">Come iniziare a investire con piccole somme</h1>
<p>Investire non è solo per i ricchi. Anche chi ha piccole somme può iniziare a costruire un portafoglio di investimenti.</p>
<h2 id="perché-iniziare-a-investire">Perché iniziare a investire</h2>
<p>Investire è uno dei modi migliori per far crescere il proprio patrimonio nel lungo periodo. Anche piccole somme, investite regolarmente, possono crescere significativamente grazie all'interesse composto.</p>
<h2 id="da-dove-iniziare">Da dove iniziare</h2>
<h3 id="1-etf-exchange-traded-fund">1. ETF (Exchange Traded Fund)</h3>
<p>Gli ETF sono fondi che replicano l'andamento di un indice, come il FTSE MIB o l'S&amp;P 500. Sono un ottimo modo per diversificare il proprio portafoglio anche con piccole somme.</p>
<h3 id="2-piani-di-accumulo-pac">2. Piani di accumulo (PAC)</h3>
<p>I piani di accumulo ti permettono di investire piccole somme regolarmente, ad esempio 50-100€ al mese. Questo approccio riduce il rischio del market timing.</p>
<h3 id="3-app-di-micro-investimento">3. App di micro-investimento</h3>
<p>Esistono diverse app che ti permettono di iniziare a investire con somme minime, alcune addirittura arrotondando i tuoi acquisti quotidiani.</p>
<h2 id="consigli-per-iniziare">Consigli per iniziare</h2>
<ul>
<li>Inizia con una somma che sei disposto a perdere</li>
<li>Investi regolarmente</li>
<li>Diversifica il tuo portafoglio</li>
<li>Pensa a lungo termine</li>
<li>Continua a educarti sul mondo finanziario</li>
</ul>
<p>Ricorda, l'importante non è quanto investi all'inizio, ma la costanza e la disciplina nel tempo.</p>`
  },
  'secondo-articolo': {
    slug: 'secondo-articolo',
    title: 'L\'importanza del fondo di emergenza',
    date: '2023-06-20',
    excerpt: 'Perché è fondamentale avere un fondo di emergenza e come costruirlo',
    content: `<h1 id="l'importanza-del-fondo-di-emergenza">L'importanza del fondo di emergenza</h1>
<p>Prima di iniziare a investire, è fondamentale costruire un fondo di emergenza adeguato alle proprie necessità.</p>
<h2 id="cos'è-un-fondo-di-emergenza">Cos'è un fondo di emergenza?</h2>
<p>Un fondo di emergenza è una somma di denaro messa da parte per affrontare spese impreviste o periodi di difficoltà economica. È la base di qualsiasi piano finanziario solido.</p>
<h2 id="quanto-dovrebbe-essere-grande">Quanto dovrebbe essere grande?</h2>
<p>La regola generale suggerisce di avere da 3 a 6 mesi di spese essenziali. Questo significa che se le tue spese mensili necessarie (affitto, bollette, cibo, etc.) ammontano a 1.500€, il tuo fondo dovrebbe essere tra 4.500€ e 9.000€.</p>
<p>Tuttavia, l'importo ideale dipende da:</p>
<ul>
<li>La stabilità del tuo lavoro</li>
<li>Se hai figli o persone a carico</li>
<li>La tua copertura assicurativa</li>
<li>Altre fonti di reddito</li>
</ul>
<h2 id="dove-tenere-il-fondo-di-emergenza">Dove tenere il fondo di emergenza</h2>
<p>Il fondo di emergenza deve essere:</p>
<ol>
<li>Facilmente accessibile</li>
<li>Non soggetto a forti oscillazioni</li>
<li>Possibilmente con un rendimento che batta l'inflazione</li>
</ol>
<p>Buone opzioni includono:</p>
<ul>
<li>Conti deposito</li>
<li>Conti correnti con interessi</li>
<li>Fondi monetari a basso rischio</li>
</ul>
<h2 id="come-costruire-il-tuo-fondo-di-emergenza">Come costruire il tuo fondo di emergenza</h2>
<ol>
<li>Stabilisci un obiettivo chiaro</li>
<li>Crea un piano di risparmio mensile</li>
<li>Automatizza i versamenti</li>
<li>Utilizza bonus o entrate straordinarie</li>
<li>Rivaluta periodicamente l'importo necessario</li>
</ol>
<p>Avere un fondo di emergenza ti darà tranquillità e ti permetterà di affrontare gli imprevisti senza indebitarti o vendere i tuoi investimenti nei momenti sbagliati.</p>`
  }
};

export function getAllPosts(): BlogPost[] {
  const posts = Object.values(blogPosts);
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts[slug];
}
