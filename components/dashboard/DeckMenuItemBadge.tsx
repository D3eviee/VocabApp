const badgeConfig: Record<string, { label: string; style: string }> = {
  noun:         { label: "Noun", style: "bg-blue-50 text-blue-700 border-blue-200" },
  verb:         { label: "Verb", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  adjective:    { label: "Adjective", style: "bg-purple-50 text-purple-700 border-purple-200" },
  adverb:       { label: "Adverb", style: "bg-amber-50 text-amber-700 border-amber-200" },
  phrasal_verb: { label: "Phrasal Verb", style: "bg-teal-50 text-teal-700 border-teal-200" },
  idiom:        { label: "Idiom", style: "bg-rose-50 text-rose-700 border-rose-200" },
  preposition:  { label: "Preposition", style: "bg-slate-50 text-slate-700 border-slate-200" },
  conjunction:  { label: "Conjunction", style: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  pronoun:      { label: "Pronoun", style: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  interjection: { label: "Interjection", style: "bg-orange-50 text-orange-700 border-orange-200" },
  unknown:      { label: "Draft", style: "bg-gray-50 text-gray-500 border-gray-200" },
};

export default function DeckMenuItemBadge({ type }: {type: string}) {
    const config = badgeConfig[type?.toLowerCase() || "unknown"];
    
    return (
        <span className={`shrink-0 w-fit inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${config.style}`}>
            {config.label}
        </span>
    );
}