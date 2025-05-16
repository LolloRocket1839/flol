
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
    content: marked(`
# Come iniziare a investire con piccole somme

Investire non è solo per i ricchi. Anche chi ha piccole somme può iniziare a costruire un portafoglio di investimenti.

## Perché iniziare a investire

Investire è uno dei modi migliori per far crescere il proprio patrimonio nel lungo periodo. Anche piccole somme, investite regolarmente, possono crescere significativamente grazie all'interesse composto.

## Da dove iniziare

### 1. ETF (Exchange Traded Fund)

Gli ETF sono fondi che replicano l'andamento di un indice, come il FTSE MIB o l'S&P 500. Sono un ottimo modo per diversificare il proprio portafoglio anche con piccole somme.

### 2. Piani di accumulo (PAC)

I piani di accumulo ti permettono di investire piccole somme regolarmente, ad esempio 50-100€ al mese. Questo approccio riduce il rischio del market timing.

### 3. App di micro-investimento

Esistono diverse app che ti permettono di iniziare a investire con somme minime, alcune addirittura arrotondando i tuoi acquisti quotidiani.

## Consigli per iniziare

- Inizia con una somma che sei disposto a perdere
- Investi regolarmente
- Diversifica il tuo portafoglio
- Pensa a lungo termine
- Continua a educarti sul mondo finanziario

Ricorda, l'importante non è quanto investi all'inizio, ma la costanza e la disciplina nel tempo.`)
  },
  'secondo-articolo': {
    slug: 'secondo-articolo',
    title: 'L\'importanza del fondo di emergenza',
    date: '2023-06-20',
    excerpt: 'Perché è fondamentale avere un fondo di emergenza e come costruirlo',
    content: marked(`
# L'importanza del fondo di emergenza

Prima di iniziare a investire, è fondamentale costruire un fondo di emergenza adeguato alle proprie necessità.

## Cos'è un fondo di emergenza?

Un fondo di emergenza è una somma di denaro messa da parte per affrontare spese impreviste o periodi di difficoltà economica. È la base di qualsiasi piano finanziario solido.

## Quanto dovrebbe essere grande?

La regola generale suggerisce di avere da 3 a 6 mesi di spese essenziali. Questo significa che se le tue spese mensili necessarie (affitto, bollette, cibo, etc.) ammontano a 1.500€, il tuo fondo dovrebbe essere tra 4.500€ e 9.000€.

Tuttavia, l'importo ideale dipende da:
- La stabilità del tuo lavoro
- Se hai figli o persone a carico
- La tua copertura assicurativa
- Altre fonti di reddito

## Dove tenere il fondo di emergenza

Il fondo di emergenza deve essere:
1. Facilmente accessibile
2. Non soggetto a forti oscillazioni
3. Possibilmente con un rendimento che batta l'inflazione

Buone opzioni includono:
- Conti deposito
- Conti correnti con interessi
- Fondi monetari a basso rischio

## Come costruire il tuo fondo di emergenza

1. Stabilisci un obiettivo chiaro
2. Crea un piano di risparmio mensile
3. Automatizza i versamenti
4. Utilizza bonus o entrate straordinarie
5. Rivaluta periodicamente l'importo necessario

Avere un fondo di emergenza ti darà tranquillità e ti permetterà di affrontare gli imprevisti senza indebitarti o vendere i tuoi investimenti nei momenti sbagliati.`)
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
