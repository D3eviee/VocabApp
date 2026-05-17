import { create } from 'zustand';

export interface StoryboardDraft {
  id?: string;
  deckId?: string;
  title: string | null;
  description: string | null;
  dateLabel: string | null;
  order?: number | null;
}

interface StoryboardStore {
  activePartId: string | null;
  setActivePartId: (id: string | null) => void;
  formData: StoryboardDraft | null;
  setFormData: (data: StoryboardDraft | null) => void;
  updateField: (field: keyof StoryboardDraft, value: string | null) => void;
}

export const useStoryboardStore = create<StoryboardStore>((set) => ({
  activePartId: null,
  formData: null,

  setActivePartId: (id) => set({ activePartId: id }),
  setFormData: (data) => set({ formData: data }),
  updateField: (field, value) => set((state) => ({
    formData: state.formData 
      ? { ...state.formData, [field]: value } 
      : null
  })),
}));