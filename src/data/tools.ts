
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
  }
];
