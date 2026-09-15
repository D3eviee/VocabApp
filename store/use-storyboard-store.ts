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
  activeStoryboardItemId: string | null;
  setActivePartId: (id: string | null) => void;
  activeStoryboardItem: StoryboardDraft | null;
  setActiveStoryboardItem: (data: StoryboardDraft | null) => void;
  updateField: (field: keyof StoryboardDraft, value: string | null) => void;
}

export const useStoryboardStore = create<StoryboardStore>((set) => ({
  activeStoryboardItemId: null,
  activeStoryboardItem: null,

  setActivePartId: (id) => set({ activeStoryboardItemId: id }),
  setActiveStoryboardItem: (data) => set({ activeStoryboardItem: data }),
  updateField: (field, value) => set((state) => ({
    activeStoryboardItem: state.activeStoryboardItem 
      ? { ...state.activeStoryboardItem, [field]: value } 
      : null
  })),
}));
