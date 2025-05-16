
export interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export const tools: Tool[] = [
  {
    slug: "interesse-composto",
    title: "Calcolatore Interesse Composto",
    description: "Calcola quanto cresceranno i tuoi investimenti nel tempo grazie all'interesse composto",
    icon: "📈",
    category: "Investimenti"
  },
  {
    slug: "fire-calculator",
    title: "Calcolatore FIRE",
    description: "Calcola quando potrai raggiungere l'indipendenza finanziaria in base ai tuoi risparmi e spese",
    icon: "🔥",
    category: "Pianificazione"
  },
  {
    slug: "fire-calculator-advanced",
    title: "Calcolatore FIRE Avanzato",
    description: "Pianifica il tuo percorso verso l'indipendenza finanziaria con un'analisi dettagliata e interattiva",
    icon: "⚡",
    category: "Pianificazione"
  },
  {
    slug: "budget-calculator",
    title: "Calcolatore Budget Mensile",
    description: "Organizza e visualizza il tuo budget mensile con il metodo 50/30/20",
    icon: "💰",
    category: "Gestione"
  },
  {
    slug: "mortgage-calculator",
    title: "Calcolatore Mutuo",
    description: "Calcola rate, interessi totali e crea piani di ammortamento dettagliati per il tuo mutuo",
    icon: "🏠",
    category: "Immobiliare"
  }
];
