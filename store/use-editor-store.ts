import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "phrasal_verb" | "idiom";

export interface Meaning {
    id: string; 
    back: string;
    examples: string[];
}

export interface Variation {
    id: string;
    word: string;
    partOfSpeech: PartOfSpeech | string;
    meanings: Meaning[];
}

export interface FlashcardDraft {
    id?: string;
    deckId?: string;
    front: string;
    partOfSpeech: PartOfSpeech | string; // Wróciło na samą górę!
    meanings: Meaning[]; 
    variations: Variation[];
}

const MEANING_TEMPLATE: Omit<Meaning, "id" | "examples"> = { back: "" };

const VARIATION_TEMPLATE: Omit<Variation, "id" | "meanings"> = {
    word: "",
    partOfSpeech: "noun",
};

export type FlashcardEditorStore = {
    activeCardId: string | null;
    formData: FlashcardDraft | null;
  
    setActiveCardId: (id: string | null) => void;
    setFormData: (data: FlashcardDraft | null) => void;

    updateMainField: <K extends keyof FlashcardDraft>(field: K, value: FlashcardDraft[K]) => void;

    // ZNACZENIA GŁÓWNEGO SŁOWA
    addMeaning: () => void;
    removeMeaning: (index: number) => void;
    updateMeaningField: <K extends keyof Meaning>(mIndex: number, field: K, value: Meaning[K]) => void;
    addMeaningExample: (mIndex: number) => void;
    updateMeaningExample: (mIndex: number, exIndex: number, value: string) => void;
    removeMeaningExample: (mIndex: number, exIndex: number) => void;

    // WARIACJE
    addVariation: () => void;
    removeVariation: (index: number) => void;
    updateVariationField: <K extends keyof Variation>(varIndex: number, field: K, value: Variation[K]) => void;
    
    // ZNACZENIA WARIACJI
    addVariationMeaning: (varIndex: number) => void;
    removeVariationMeaning: (varIndex: number, mIndex: number) => void;
    updateVariationMeaningField: (varIndex: number, mIndex: number, field: keyof Meaning, value: string) => void;
    addVariationMeaningExample: (varIndex: number, mIndex: number) => void;
    updateVariationMeaningExample: (varIndex: number, mIndex: number, exIndex: number, value: string) => void;
    removeVariationMeaningExample: (varIndex: number, mIndex: number, exIndex: number) => void;
}

// store/use-editor-store.ts
// ... (początek pliku pozostaje bez zmian)

export const useEditorStore = create<FlashcardEditorStore>()(immer((set) => ({
    activeCardId: null,
    formData: null,

    

    setActiveCardId: (id) => set((state) => { state.activeCardId = id }),
    setFormData: (data) => set((state) => { state.formData = data as any }),

    updateMainField: (field, value) => set((state) => {
        if (!state.formData) return;
        state.formData[field] = value as any;
    }),
    
    // === GŁÓWNE ZNACZENIA ===
    addMeaning: () => set((state) => {
        if (!state.formData) return;
        if (!state.formData.meanings) state.formData.meanings = [];
        // ZMIANA: Pusta tablica przykładów na start
        state.formData.meanings.push({ id: crypto.randomUUID(), ...MEANING_TEMPLATE, examples: [] });
    }),
    removeMeaning: (mIndex) => set((state) => { state.formData?.meanings?.splice(mIndex, 1); }),
    updateMeaningField: (mIndex, field, value) => set((state) => {
        if (state.formData?.meanings?.[mIndex]) state.formData.meanings[mIndex][field] = value as any;
    }),
    addMeaningExample: (mIndex) => set((state) => {
        state.formData?.meanings?.[mIndex]?.examples.push("");
    }),
    updateMeaningExample: (mIndex, exIndex, value) => set((state) => {
        if (state.formData?.meanings?.[mIndex]?.examples) state.formData.meanings[mIndex].examples[exIndex] = value;
    }),
    removeMeaningExample: (mIndex, exIndex) => set((state) => {
        state.formData?.meanings?.[mIndex]?.examples.splice(exIndex, 1);
    }),

    // === WARIACJE ===
    addVariation: () => set((state) => {
        if (!state.formData) return;
        if (!state.formData.variations) state.formData.variations = [];
        state.formData.variations.push({ 
            id: crypto.randomUUID(), 
            ...VARIATION_TEMPLATE, 
            // ZMIANA: Pusta tablica przykładów na start dla znaczenia wewnątrz wariacji
            meanings: [{ id: crypto.randomUUID(), ...MEANING_TEMPLATE, examples: [] }] 
        });
    }),
    removeVariation: (index) => set((state) => { state.formData?.variations?.splice(index, 1); }),
    updateVariationField: (varIndex, field, value) => set((state) => {
        if (state.formData?.variations?.[varIndex]) state.formData.variations[varIndex][field] = value as any;
    }),

    // === ZNACZENIA WARIACJI ===
    addVariationMeaning: (varIndex) => set((state) => {
        // ZMIANA: Pusta tablica przykładów na start
        state.formData?.variations?.[varIndex]?.meanings.push({ id: crypto.randomUUID(), ...MEANING_TEMPLATE, examples: [] });
    }),
    removeVariationMeaning: (varIndex, mIndex) => set((state) => {
        state.formData?.variations?.[varIndex]?.meanings.splice(mIndex, 1);
    }),
    updateVariationMeaningField: (varIndex, mIndex, field, value) => set((state) => {
        if (state.formData?.variations?.[varIndex]?.meanings?.[mIndex]) {
            state.formData.variations[varIndex].meanings[mIndex][field] = value as any;
        }
    }),
    addVariationMeaningExample: (varIndex, mIndex) => set((state) => {
        state.formData?.variations?.[varIndex]?.meanings?.[mIndex]?.examples.push("");
    }),
    updateVariationMeaningExample: (varIndex, mIndex, exIndex, value) => set((state) => {
        if (state.formData?.variations?.[varIndex]?.meanings?.[mIndex]?.examples) {
            state.formData.variations[varIndex].meanings[mIndex].examples[exIndex] = value;
        }
    }),
    removeVariationMeaningExample: (varIndex, mIndex, exIndex) => set((state) => {
        state.formData?.variations?.[varIndex]?.meanings?.[mIndex]?.examples.splice(exIndex, 1);
    }),
})));